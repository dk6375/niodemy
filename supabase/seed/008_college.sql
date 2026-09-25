-- ============================================
-- Seed Data: College Degrees + Semesters + Subjects
-- ============================================
-- For Session 11: College segment demo

-- ============================================
-- DEGREES
-- ============================================

insert into public.degrees (slug, name, short_name, level, duration_years, total_semesters, field, description, seo_json, status)
values
(
  'btech-cse',
  'B.Tech Computer Science Engineering',
  'B.Tech CSE',
  'undergraduate',
  4,
  8,
  'Engineering',
  'Bachelor of Technology in Computer Science Engineering. 4-year program covering programming, algorithms, databases, networks, AI/ML, and software engineering.',
  jsonb_build_object(
    'title', 'B.Tech CSE — Semester-wise Notes, Solutions, PYQs',
    'description', 'Free B.Tech CSE semester-wise study material, notes, solutions, previous year papers.',
    'indexable', true
  ),
  'active'
) on conflict (slug) do nothing;

insert into public.degrees (slug, name, short_name, level, duration_years, total_semesters, field, description, seo_json, status)
values
(
  'bsc-computer-science',
  'B.Sc Computer Science',
  'B.Sc CS',
  'undergraduate',
  3,
  6,
  'Science',
  'Bachelor of Science in Computer Science. 3-year program covering programming, data structures, databases, and computer applications.',
  jsonb_build_object(
    'title', 'B.Sc CS — Semester-wise Notes, Solutions, PYQs',
    'description', 'Free B.Sc Computer Science semester-wise study material, notes, solutions, previous year papers.',
    'indexable', true
  ),
  'active'
) on conflict (slug) do nothing;

insert into public.degrees (slug, name, short_name, level, duration_years, total_semesters, field, description, seo_json, status)
values
(
  'bcom',
  'Bachelor of Commerce (B.Com)',
  'B.Com',
  'undergraduate',
  3,
  6,
  'Commerce',
  'Bachelor of Commerce. 3-year program covering accounting, finance, economics, business management, and taxation.',
  jsonb_build_object(
    'title', 'B.Com — Semester-wise Notes, Solutions, PYQs',
    'description', 'Free B.Com semester-wise study material, notes, solutions, previous year papers.',
    'indexable', true
  ),
  'active'
) on conflict (slug) do nothing;

-- ============================================
-- SEMESTERS for B.Tech CSE (8 semesters)
-- ============================================

insert into public.semesters (degree_id, semester_number, year, title)
select id, 1, 1, 'Semester 1 — First Year'
from public.degrees where slug = 'btech-cse'
on conflict (degree_id, semester_number) do nothing;

insert into public.semesters (degree_id, semester_number, year, title)
select id, 2, 1, 'Semester 2 — First Year'
from public.degrees where slug = 'btech-cse'
on conflict (degree_id, semester_number) do nothing;

insert into public.semesters (degree_id, semester_number, year, title)
select id, 3, 2, 'Semester 3 — Second Year'
from public.degrees where slug = 'btech-cse'
on conflict (degree_id, semester_number) do nothing;

insert into public.semesters (degree_id, semester_number, year, title)
select id, 4, 2, 'Semester 4 — Second Year'
from public.degrees where slug = 'btech-cse'
on conflict (degree_id, semester_number) do nothing;

insert into public.semesters (degree_id, semester_number, year, title)
select id, 5, 3, 'Semester 5 — Third Year'
from public.degrees where slug = 'btech-cse'
on conflict (degree_id, semester_number) do nothing;

insert into public.semesters (degree_id, semester_number, year, title)
select id, 6, 3, 'Semester 6 — Third Year'
from public.degrees where slug = 'btech-cse'
on conflict (degree_id, semester_number) do nothing;

-- ============================================
-- SEMESTER SUBJECTS for B.Tech CSE (Semester 3 — sample)
-- ============================================

insert into public.semester_subjects (semester_id, subject_code, subject_name, credits, subject_type, description)
select s.id, 'CS301', 'Data Structures and Algorithms', 4, 'core', 'Arrays, linked lists, stacks, queues, trees, graphs, sorting, searching algorithms.'
from public.semesters s
join public.degrees d on s.degree_id = d.id
where d.slug = 'btech-cse' and s.semester_number = 3
on conflict do nothing;

insert into public.semester_subjects (semester_id, subject_code, subject_name, credits, subject_type, description)
select s.id, 'CS302', 'Database Management Systems', 4, 'core', 'ER diagrams, normalization, SQL, transactions, indexing, NoSQL.'
from public.semesters s
join public.degrees d on s.degree_id = d.id
where d.slug = 'btech-cse' and s.semester_number = 3
on conflict do nothing;

insert into public.semester_subjects (semester_id, subject_code, subject_name, credits, subject_type, description)
select s.id, 'CS303', 'Object Oriented Programming (Java)', 4, 'core', 'Classes, objects, inheritance, polymorphism, encapsulation, Java fundamentals.'
from public.semesters s
join public.degrees d on s.degree_id = d.id
where d.slug = 'btech-cse' and s.semester_number = 3
on conflict do nothing;

insert into public.semester_subjects (semester_id, subject_code, subject_name, credits, subject_type, description)
select s.id, 'MA301', 'Engineering Mathematics III', 4, 'core', 'Probability, statistics, numerical methods, complex variables, transforms.'
from public.semesters s
join public.degrees d on s.degree_id = d.id
where d.slug = 'btech-cse' and s.semester_number = 3
on conflict do nothing;

insert into public.semester_subjects (semester_id, subject_code, subject_name, credits, subject_type, description)
select s.id, 'CS301L', 'Data Structures Lab', 2, 'lab', 'Practical implementation of data structures in C/Java.'
from public.semesters s
join public.degrees d on s.degree_id = d.id
where d.slug = 'btech-cse' and s.semester_number = 3
on conflict do nothing;

-- ============================================
-- SEMESTER SUBJECTS for B.Tech CSE (Semester 5 — sample)
-- ============================================

insert into public.semester_subjects (semester_id, subject_code, subject_name, credits, subject_type, description)
select s.id, 'CS501', 'Operating Systems', 4, 'core', 'Process management, scheduling, memory management, file systems, deadlocks.'
from public.semesters s
join public.degrees d on s.degree_id = d.id
where d.slug = 'btech-cse' and s.semester_number = 5
on conflict do nothing;

insert into public.semester_subjects (semester_id, subject_code, subject_name, credits, subject_type, description)
select s.id, 'CS502', 'Computer Networks', 4, 'core', 'OSI/TCP-IP models, protocols, routing, network security, wireless networks.'
from public.semesters s
join public.degrees d on s.degree_id = d.id
where d.slug = 'btech-cse' and s.semester_number = 5
on conflict do nothing;

insert into public.semester_subjects (semester_id, subject_code, subject_name, credits, subject_type, description)
select s.id, 'CS503', 'Software Engineering', 3, 'core', 'SDLC, agile, testing, project management, design patterns.'
from public.semesters s
join public.degrees d on s.degree_id = d.id
where d.slug = 'btech-cse' and s.semester_number = 5
on conflict do nothing;

insert into public.semester_subjects (semester_id, subject_code, subject_name, credits, subject_type, description)
select s.id, 'CS504', 'Theory of Computation', 4, 'core', 'Finite automata, regular expressions, context-free grammars, Turing machines, computability.'
from public.semesters s
join public.degrees d on s.degree_id = d.id
where d.slug = 'btech-cse' and s.semester_number = 5
on conflict do nothing;

-- ============================================
-- SEMESTERS for B.Sc CS (6 semesters — first 3 for demo)
-- ============================================

insert into public.semesters (degree_id, semester_number, year, title)
select id, 1, 1, 'Semester 1 — First Year'
from public.degrees where slug = 'bsc-computer-science'
on conflict (degree_id, semester_number) do nothing;

insert into public.semesters (degree_id, semester_number, year, title)
select id, 2, 1, 'Semester 2 — First Year'
from public.degrees where slug = 'bsc-computer-science'
on conflict (degree_id, semester_number) do nothing;

-- ============================================
-- SEMESTER SUBJECTS for B.Sc CS (Semester 1)
-- ============================================

insert into public.semester_subjects (semester_id, subject_code, subject_name, credits, subject_type, description)
select s.id, 'CS101', 'Introduction to Programming (C)', 4, 'core', 'Variables, data types, control structures, functions, arrays, pointers.'
from public.semesters s
join public.degrees d on s.degree_id = d.id
where d.slug = 'bsc-computer-science' and s.semester_number = 1
on conflict do nothing;

insert into public.semester_subjects (semester_id, subject_code, subject_name, credits, subject_type, description)
select s.id, 'MA101', 'Mathematics I', 4, 'core', 'Calculus, differential equations, linear algebra basics.'
from public.semesters s
join public.degrees d on s.degree_id = d.id
where d.slug = 'bsc-computer-science' and s.semester_number = 1
on conflict do nothing;

insert into public.semester_subjects (semester_id, subject_code, subject_name, credits, subject_type, description)
select s.id, 'PH101', 'Physics I', 4, 'core', 'Mechanics, optics, thermodynamics, waves.'
from public.semesters s
join public.degrees d on s.degree_id = d.id
where d.slug = 'bsc-computer-science' and s.semester_number = 1
on conflict do nothing;
