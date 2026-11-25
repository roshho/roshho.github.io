---
layout: reference
title: Python prep
description: A quick Python syntax reference for files, collections, heaps, and dates.
permalink: /python-prep/
pdf: /attachments/pdf/python_prep.pdf
---

# Python syntax reference

[rendered_pdf](/attachments/pdf/python_prep.pdf)

```python
import json
import heapq
from pathlib import Path
from collections import Counter, defaultdict, deque
from datetime import datetime, timezone

# Read a JSON file in the same folder as this script.
file_path = Path(__file__).parent / "docs" / "patients.json"
with file_path.open(encoding="utf-8") as file:
    data = json.load(file)  # JSON file -> Python dict/list

print(json.dumps(data, indent=2))

patients = data["patients"]
# Example: patients[0]["name"] -> "Alice"

# Other conversions (not needed to read a file):
# data = json.loads('{"patients": []}')  # JSON string -> Python
# text = json.dumps(data, indent=2)      # Python -> JSON string
# with open("out.json", "w", encoding="utf-8") as file:
#     json.dump(data, file, indent=2)    # Python -> JSON file

row = {"id": "p1", "name": None}
row.get("missing", [])      # [] (default applies only to absent keys)
row.get("name") or ""       # empty string for None or other false values
list(row.items())           # [("id", "p1"), ("name", None)]
list(row.keys())            # ["id", "name"]
list(row.values())          # ["p1", None]

by_patient = defaultdict(list)
by_patient["p1"].append(row)
counts = Counter(["a", "b", "a"])
counts["a"]                 # 2
seen = set()
seen.add(("provider-a", "record-1"))  # tuple is a hashable composite key
unique = {1, 2, 2}           # {1, 2}; membership is average O(1)

# Min-heap: smallest first.
heap = [5, 2, 8]            # deque([5,2,8])
heapq.heapify(heap)         # O(n)
heapq.heappush(heap, 1)     # O(log n)          deque.appendleft(2) || deque.append(2)
print(heap[0])             # 1
smallest = heapq.heappop(heap)  # 1; O(log n)   deque.popleft()
while heap:
    print(heapq.heappop(heap))  # 2, then 5, then 8

ids = [r["id"] for r in [row] if r.get("id")]
index = {r["id"]: r for r in [row]}
ordered = sorted([row], key=lambda r: (r.get("name") or "", r["id"]))
# sorted returns a new list; list.sort mutates and returns None.
for i, value in enumerate(ids, start=1):
    print(i, value)
for patient, provider in zip(["p1"], ["d1"]):
    print(patient, provider)  # zip stops at shorter iterable

stamp = datetime.fromisoformat("2026-01-01T10:00:00+00:00")
other = datetime.fromisoformat("2026-01-01T12:00:00+02:00")
assert stamp == other       # compare aware timestamps by actual instant
utc = stamp.astimezone(timezone.utc)
try:
    number = int("42")
except (ValueError, TypeError) as error:
    raise ValueError("expected an integer") from error
```
