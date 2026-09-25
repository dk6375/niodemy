-- ============================================
-- Seed Data: Skill Tracks + Modules
-- ============================================
-- For Session 13: Skills segment — W3Schools-style tutorials

-- ============================================
-- SKILL TRACKS
-- ============================================

insert into public.skill_tracks (slug, name, short_name, description, icon, level, total_modules, estimated_hours, tags, seo_json, status)
values
(
  'python-programming',
  'Python Programming',
  'Python',
  'Learn Python from scratch. Variables, data types, control flow, functions, OOP, file handling, and real-world projects.',
  '🐍',
  'all-levels',
  8,
  20,
  ARRAY['programming', 'python', 'coding'],
  jsonb_build_object(
    'title', 'Python Programming Tutorial — Learn Python Free',
    'description', 'Free Python tutorial. Variables, loops, functions, OOP, projects. W3Schools-style — browse free.',
    'indexable', true
  ),
  'active'
) on conflict (slug) do nothing;

insert into public.skill_tracks (slug, name, short_name, description, icon, level, total_modules, estimated_hours, tags, seo_json, status)
values
(
  'excel-mastery',
  'Excel Mastery',
  'Excel',
  'Master Microsoft Excel. Formulas, functions, charts, pivot tables, data analysis, and automation.',
  '📊',
  'all-levels',
  6,
  15,
  ARRAY['excel', 'office', 'data-analysis'],
  jsonb_build_object(
    'title', 'Excel Tutorial — Formulas, Functions, Pivot Tables Free',
    'description', 'Free Excel tutorial. Formulas, charts, pivot tables, data analysis. W3Schools-style.',
    'indexable', true
  ),
  'active'
) on conflict (slug) do nothing;

insert into public.skill_tracks (slug, name, short_name, description, icon, level, total_modules, estimated_hours, tags, seo_json, status)
values
(
  'digital-marketing',
  'Digital Marketing',
  'Marketing',
  'Learn digital marketing: SEO, social media, content marketing, email marketing, and analytics.',
  '📱',
  'beginner',
  5,
  12,
  ARRAY['marketing', 'seo', 'social-media'],
  jsonb_build_object(
    'title', 'Digital Marketing Tutorial — SEO, Social Media, Content Free',
    'description', 'Free digital marketing tutorial. SEO, social media, email marketing, analytics.',
    'indexable', true
  ),
  'active'
) on conflict (slug) do nothing;

-- ============================================
-- PYTHON MODULES (8 tutorials)
-- ============================================

insert into public.skill_modules (track_id, module_number, title, slug, description, body_md, is_interactive, estimated_minutes)
select t.id, 1, 'Python Introduction', 'python-introduction',
  'What is Python? Why learn it? Setting up Python.',
  '# Python Introduction

## What is Python?

Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum in 1991.

## Why Learn Python?

- **Easy to learn** — simple syntax, reads like English
- **Versatile** — web, data science, AI/ML, automation, scripting
- **Huge community** — extensive libraries and frameworks
- **High demand** — top programming language for jobs

## Install Python

Download from [python.org](https://python.org). Verify installation:

```bash
python --version
# Python 3.12.0
```

## Your First Program

```python
print("Hello, World!")
```

Output:
```
Hello, World!
```

> **Try it yourself:** Open a Python REPL and run `print("Hello, Niodemy!")`',
  false, 15
from public.skill_tracks t where t.slug = 'python-programming'
on conflict do nothing;

insert into public.skill_modules (track_id, module_number, title, slug, description, body_md, is_interactive, estimated_minutes)
select t.id, 2, 'Variables & Data Types', 'variables-data-types',
  'Python variables, numbers, strings, lists, tuples, dictionaries.',
  '# Variables & Data Types

## Variables

Variables are containers for storing data values.

```python
name = "Alice"
age = 25
height = 5.6
is_student = True
```

## Data Types

| Type | Example | Description |
|------|---------|-------------|
| `int` | `42` | Integer |
| `float` | `3.14` | Decimal |
| `str` | `"hello"` | String |
| `bool` | `True` | Boolean |
| `list` | `[1, 2, 3]` | Ordered collection |
| `tuple` | `(1, 2, 3)` | Immutable collection |
| `dict` | `{"a": 1}` | Key-value pairs |

## Check Type

```python
x = 42
print(type(x))  # <class ''int''>
```

## Try It Yourself

```python
# Create your own variables
my_name = "Your Name"
my_age = 20
print(f"Hi, I am {my_name}, {my_age} years old")
```',
  true, 20
from public.skill_tracks t where t.slug = 'python-programming'
on conflict do nothing;

insert into public.skill_modules (track_id, module_number, title, slug, description, body_md, is_interactive, estimated_minutes)
select t.id, 3, 'Control Flow (if/else, loops)', 'control-flow',
  'Conditional statements, for loops, while loops.',
  '# Control Flow

## if-else Statements

```python
age = 18
if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teenager")
else:
    print("Child")
```

## For Loops

```python
for i in range(5):
    print(i)
# Output: 0 1 2 3 4

fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
```

## While Loops

```python
count = 0
while count < 5:
    print(count)
    count += 1
```

## Try It Yourself

```python
# Print even numbers from 1 to 10
for i in range(1, 11):
    if i % 2 == 0:
        print(i)
```',
  true, 25
from public.skill_tracks t where t.slug = 'python-programming'
on conflict do nothing;

insert into public.skill_modules (track_id, module_number, title, slug, description, body_md, is_interactive, estimated_minutes)
select t.id, 4, 'Functions', 'functions',
  'Define and call functions, parameters, return values.',
  '# Functions

## Defining Functions

```python
def greet(name):
    return f"Hello, {name}!"

print(greet("Alice"))  # Hello, Alice!
```

## Parameters & Arguments

```python
def add(a, b):
    return a + b

result = add(5, 3)  # 8
```

## Default Parameters

```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Bob"))  # Hello, Bob!
print(greet("Bob", "Hi"))  # Hi, Bob!
```

## Try It Yourself

```python
# Write a function to check if a number is prime
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

print(is_prime(17))  # True
```',
  true, 25
from public.skill_tracks t where t.slug = 'python-programming'
on conflict do nothing;

-- ============================================
-- EXCEL MODULES (6 tutorials)
-- ============================================

insert into public.skill_modules (track_id, module_number, title, slug, description, body_md, is_interactive, estimated_minutes)
select t.id, 1, 'Excel Basics', 'excel-basics',
  'Introduction to Excel: cells, rows, columns, worksheets.',
  '# Excel Basics

## What is Excel?

Microsoft Excel is a spreadsheet application for data organization, analysis, and visualization.

## Excel Interface

- **Cell** — intersection of row and column (e.g., A1, B2)
- **Row** — horizontal (numbered 1, 2, 3...)
- **Column** — vertical (lettered A, B, C...)
- **Worksheet** — single spreadsheet tab
- **Workbook** — Excel file containing worksheets

## Entering Data

Click any cell and type:
- Numbers: `42`, `3.14`
- Text: `Hello World`
- Dates: `01/15/2025`
- Formulas: `=A1+B1`

## Basic Formulas

| Formula | Description |
|---------|-------------|
| `=SUM(A1:A10)` | Sum of range |
| `=AVERAGE(A1:A10)` | Average |
| `=MAX(A1:A10)` | Maximum |
| `=MIN(A1:A10)` | Minimum |
| `=COUNT(A1:A10)` | Count cells |

## Try It Yourself

1. Open Excel
2. Enter numbers in cells A1 to A5
3. In A6, type `=SUM(A1:A5)`
4. Press Enter',
  false, 15
from public.skill_tracks t where t.slug = 'excel-mastery'
on conflict do nothing;

insert into public.skill_modules (track_id, module_number, title, slug, description, body_md, is_interactive, estimated_minutes)
select t.id, 2, 'Formulas & Functions', 'formulas-functions',
  'SUM, AVERAGE, IF, VLOOKUP, COUNTIF, and more.',
  '# Formulas & Functions

## IF Function

```excel
=IF(A1>=50, "Pass", "Fail")
```

## VLOOKUP

Look up a value in a table:

```excel
=VLOOKUP(A1, B1:D10, 2, FALSE)
```

- `A1` — value to find
- `B1:D10` — table range
- `2` — column index to return
- `FALSE` — exact match

## COUNTIF

```excel
=COUNTIF(A1:A10, ">50")
```

## CONCATENATE

```excel
=CONCATENATE(A1, " ", B1)
```

## Try It Yourself

Create a grade sheet:
1. Column A: Student names
2. Column B: Marks (0-100)
3. Column C: `=IF(B1>=40, "Pass", "Fail")`
4. Cell E1: `=COUNTIF(C1:C10, "Pass")`',
  true, 25
from public.skill_tracks t where t.slug = 'excel-mastery'
on conflict do nothing;
