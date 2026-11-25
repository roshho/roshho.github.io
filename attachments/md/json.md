---
layout: reference
title: JSON prep
description: A Python reference for reading JSON, validating nested records with Pydantic, and querying them with pandas and SQLite.
permalink: /json-prep/
---

# JSON in Python

## Read JSON

`patients.json`

```json
{
  "patients": [
    {
      "id": "p1",
      "name": "Alice",
      "clinic": {"name": "North"},
      "visits": [
        {
          "visit_id": "v1",
          "visit_date": "2026-01-05",
          "status": "completed",
          "charge_cents": 12000
        },
        {
          "visit_id": "v2",
          "visit_date": "2026-01-12",
          "status": "canceled",
          "charge_cents": 0
        }
      ]
    },
    {
      "id": "p2",
      "name": "Ben",
      "clinic": {"name": "South"},
      "visits": [
        {
          "visit_id": "v3",
          "visit_date": "2026-01-08",
          "status": "completed",
          "charge_cents": 8500
        }
      ]
    },
    {"id": "p3", "name": "Cara", "clinic": {"name": "North"}}
  ]
}
```

```python
import json
from pathlib import Path

path = Path("patients.json")
with path.open(encoding="utf-8") as file:
    data = json.load(file)            # JSON file → dict

text = json.dumps(data, indent=2)      # dict → JSON string
round_trip = json.loads(text)          # JSON string → dict
# with open("output.json", "w", encoding="utf-8") as file:
#     json.dump(data, file, indent=2)  # dict → JSON file
```

## Validate with Pydantic v2

```python
from datetime import date
from typing import Literal

from pydantic import BaseModel, Field, ValidationError


class Clinic(BaseModel):
    name: str


class Visit(BaseModel):
    visit_id: str
    visit_date: date
    status: Literal["completed", "canceled"]
    charge_cents: int = Field(ge=0)


class Patient(BaseModel):
    id: str
    name: str
    clinic: Clinic
    visits: list[Visit] = Field(default_factory=list)


class PatientFile(BaseModel):
    patients: list[Patient]


batch = PatientFile.model_validate(data)
# From JSON text: batch = PatientFile.model_validate_json(text)
# For one row: patient = Patient.model_validate(data["patients"][0])

first_visit_date = batch.patients[0].visits[0].visit_date  # date(2026, 1, 5)
records = [patient.model_dump(mode="json") for patient in batch.patients]
```

```python
try:
    Visit.model_validate({
        "visit_id": "v4",
        "visit_date": "2026-01-15",
        "status": "pending",
        "charge_cents": -100,
    })
except ValidationError as exc:
    for error in exc.errors():
        print(error["loc"], error["msg"])  # status and charge_cents
```

## Flatten patients and visits with pandas

```python
import pandas as pd

# One row per patient, including patients with zero visits.
patients = (
    pd.json_normalize(records)
    .drop(columns="visits")
    .rename(columns={"id": "patient_id", "clinic.name": "clinic"})
)

# One row per visit, with the parent patient ID and clinic copied onto it.
visits = pd.json_normalize(
    records,
    record_path="visits",
    meta=["id", ["clinic", "name"]],
).rename(columns={"id": "patient_id", "clinic.name": "clinic"})
visits["visit_date"] = pd.to_datetime(visits["visit_date"])
```

## Filter and summarize with pandas

```python
completed = visits.loc[visits["status"].eq("completed")].sort_values("visit_date")
columns = ["patient_id", "visit_date", "charge_cents"]
print(completed[columns].to_string(index=False))

by_clinic = completed.groupby("clinic", as_index=False).agg(
    visit_count=("visit_id", "size"),
    total_charge_cents=("charge_cents", "sum"),
)
print(by_clinic.to_string(index=False))
```

## Query with SQLite

```python
import sqlite3
from contextlib import closing

with closing(sqlite3.connect(":memory:")) as conn:
    patients[["patient_id", "clinic"]].to_sql("patients", conn, index=False)
    visits[["visit_id", "patient_id", "status", "charge_cents"]].to_sql(
        "visits", conn, index=False
    )
    by_clinic_sql = pd.read_sql_query(
        """
        SELECT p.clinic,
               COUNT(*) AS visit_count,
               SUM(v.charge_cents) AS total_charge_cents
        FROM visits AS v
        JOIN patients AS p ON p.patient_id = v.patient_id
        WHERE v.status = ?
        GROUP BY p.clinic
        ORDER BY p.clinic
        """,
        conn,
        params=("completed",),
    )

print(by_clinic_sql.to_string(index=False))
# clinic  visit_count  total_charge_cents
#  North            1               12000
#  South            1                8500
```
