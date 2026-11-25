---
layout: reference
title: JSON prep
description: A quick Python reference for reading JSON, validating records, and flattening nested data.
permalink: /json-prep/
---

# JSON in Python

## Read JSON

`patients.json`

```json
{
  "patients": [
    {"id": "p1", "name": "Alice", "clinic": {"name": "North"}}
  ]
}
```

```python
import json

with open("patients.json", encoding="utf-8") as file:
    data = json.load(file)  # JSON file → Python dict

rows = data["patients"]
text = json.dumps(data, indent=2)  # Python dict → JSON string
data = json.loads(text)            # JSON string → Python dict
```

## Validate with Pydantic v2

```python
from pydantic import BaseModel


class Clinic(BaseModel):
    name: str


class Patient(BaseModel):
    id: str
    name: str
    clinic: Clinic


patients = [Patient.model_validate(row) for row in rows]
records = [patient.model_dump() for patient in patients]
```

## Flatten with pandas

```python
import pandas as pd

df = pd.json_normalize(records)
print(df.to_string(index=False))
# id  name clinic.name
# p1 Alice       North
```
