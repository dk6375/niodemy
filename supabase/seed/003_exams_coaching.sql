-- ============================================
-- Seed Data: Competitive Exams + Syllabus Mappings
-- ============================================
-- For Session 4: Coaching segment syllabus-merge combined course demo
-- 3 exams: RRB Group D, SSC GD, MP Police

-- ============================================
-- EXAMS
-- ============================================

insert into public.exams (slug, name, category, conducting_body, description, pattern_json, eligibility_json, languages, official_url, status)
values
(
  'rrb-group-d',
  'RRB Group D',
  'railway',
  'Railway Recruitment Board',
  'RRB Group D recruitment for Level 1 posts in Indian Railways (Track Maintainer, Helper, Assistant Pointsman, etc.)',
  jsonb_build_object(
    'sections', jsonb_build_array('Mathematics', 'General Intelligence & Reasoning', 'General Science', 'General Awareness & Current Affairs'),
    'total_questions', 100,
    'total_marks', 100,
    'duration_minutes', 90,
    'negative_marking', 0.25,
    'mode', 'CBT'
  ),
  jsonb_build_object(
    'min_education', 'Class 10 / Matriculation',
    'max_age', 33,
    'age_relaxation', 'As per government norms',
    'nationality', 'Indian'
  ),
  '{hi,en}',
  'https://www.rrbcdg.gov.in/',
  'active'
) on conflict (slug) do nothing;

insert into public.exams (slug, name, category, conducting_body, description, pattern_json, eligibility_json, languages, official_url, status)
values
(
  'ssc-gd',
  'SSC GD Constable',
  'police',
  'Staff Selection Commission',
  'SSC GD Constable recruitment for General Duty Constable in BSF, CISF, CRPF, ITBP, SSB, AR, SSF',
  jsonb_build_object(
    'sections', jsonb_build_array('General Intelligence & Reasoning', 'General Knowledge & General Awareness', 'Elementary Mathematics', 'English/Hindi'),
    'total_questions', 80,
    'total_marks', 160,
    'duration_minutes', 60,
    'negative_marking', 0.5,
    'mode', 'CBT'
  ),
  jsonb_build_object(
    'min_education', 'Class 10 / Matriculation',
    'max_age', 23,
    'age_relaxation', 'As per government norms',
    'nationality', 'Indian'
  ),
  '{hi,en}',
  'https://ssc.nic.in/',
  'active'
) on conflict (slug) do nothing;

insert into public.exams (slug, name, category, conducting_body, description, pattern_json, eligibility_json, languages, official_url, status)
values
(
  'mp-police-constable',
  'MP Police Constable',
  'police',
  'Madhya Pradesh Professional Examination Board (MPPEB)',
  'MP Police Constable recruitment for General Duty Constable in Madhya Pradesh Police',
  jsonb_build_object(
    'sections', jsonb_build_array('General Knowledge & Reasoning', 'Intellectual Ability & Mental Aptitude', 'Science', 'General Hindi'),
    'total_questions', 100,
    'total_marks', 100,
    'duration_minutes', 90,
    'negative_marking', 0,
    'mode', 'CBT'
  ),
  jsonb_build_object(
    'min_education', 'Class 10 / Higher Secondary (varies by post)',
    'max_age', 25,
    'age_relaxation', 'As per MP government norms',
    'nationality', 'Indian'
  ),
  '{hi,en}',
  'https://peb.mp.gov.in/',
  'active'
) on conflict (slug) do nothing;

-- ============================================
-- EXAM CYCLES (2025)
-- ============================================

insert into public.exam_cycles (exam_id, cycle_name, year, status)
select id, name || ' 2025', 2025, 'upcoming' from public.exams
where slug in ('rrb-group-d', 'ssc-gd', 'mp-police-constable')
on conflict (exam_id, year) do nothing;

-- ============================================
-- EXAM CONCEPTS (syllabus mappings)
-- ============================================
-- Map existing concepts to each exam at appropriate depth and importance.
-- Existing concepts: photosynthesis, fundamental-rights, pythagoras-theorem, newtons-laws-of-motion, indian-parliament

-- RRB Group D mappings (basic depth L2)
insert into public.exam_concepts (exam_id, concept_id, depth_required, importance, subject)
select e.id, c.id, 2, 'high', 'General Science'
from public.exams e, public.concepts c
where e.slug = 'rrb-group-d' and c.slug = 'photosynthesis'
on conflict (exam_id, concept_id) do nothing;

insert into public.exam_concepts (exam_id, concept_id, depth_required, importance, subject)
select e.id, c.id, 2, 'high', 'General Science'
from public.exams e, public.concepts c
where e.slug = 'rrb-group-d' and c.slug = 'newtons-laws-of-motion'
on conflict (exam_id, concept_id) do nothing;

insert into public.exam_concepts (exam_id, concept_id, depth_required, importance, subject)
select e.id, c.id, 2, 'high', 'General Awareness'
from public.exams e, public.concepts c
where e.slug = 'rrb-group-d' and c.slug = 'fundamental-rights'
on conflict (exam_id, concept_id) do nothing;

insert into public.exam_concepts (exam_id, concept_id, depth_required, importance, subject)
select e.id, c.id, 2, 'high', 'General Awareness'
from public.exams e, public.concepts c
where e.slug = 'rrb-group-d' and c.slug = 'indian-parliament'
on conflict (exam_id, concept_id) do nothing;

insert into public.exam_concepts (exam_id, concept_id, depth_required, importance, subject)
select e.id, c.id, 2, 'medium', 'Mathematics'
from public.exams e, public.concepts c
where e.slug = 'rrb-group-d' and c.slug = 'pythagoras-theorem'
on conflict (exam_id, concept_id) do nothing;

-- SSC GD mappings (basic depth L2)
insert into public.exam_concepts (exam_id, concept_id, depth_required, importance, subject)
select e.id, c.id, 2, 'high', 'General Science'
from public.exams e, public.concepts c
where e.slug = 'ssc-gd' and c.slug = 'photosynthesis'
on conflict (exam_id, concept_id) do nothing;

insert into public.exam_concepts (exam_id, concept_id, depth_required, importance, subject)
select e.id, c.id, 2, 'high', 'General Science'
from public.exams e, public.concepts c
where e.slug = 'ssc-gd' and c.slug = 'newtons-laws-of-motion'
on conflict (exam_id, concept_id) do nothing;

insert into public.exam_concepts (exam_id, concept_id, depth_required, importance, subject)
select e.id, c.id, 2, 'high', 'General Knowledge'
from public.exams e, public.concepts c
where e.slug = 'ssc-gd' and c.slug = 'fundamental-rights'
on conflict (exam_id, concept_id) do nothing;

insert into public.exam_concepts (exam_id, concept_id, depth_required, importance, subject)
select e.id, c.id, 2, 'high', 'General Knowledge'
from public.exams e, public.concepts c
where e.slug = 'ssc-gd' and c.slug = 'indian-parliament'
on conflict (exam_id, concept_id) do nothing;

insert into public.exam_concepts (exam_id, concept_id, depth_required, importance, subject)
select e.id, c.id, 2, 'medium', 'Elementary Mathematics'
from public.exams e, public.concepts c
where e.slug = 'ssc-gd' and c.slug = 'pythagoras-theorem'
on conflict (exam_id, concept_id) do nothing;

-- MP Police Constable mappings (basic depth L2, Science emphasis)
insert into public.exam_concepts (exam_id, concept_id, depth_required, importance, subject)
select e.id, c.id, 2, 'high', 'Science'
from public.exams e, public.concepts c
where e.slug = 'mp-police-constable' and c.slug = 'photosynthesis'
on conflict (exam_id, concept_id) do nothing;

insert into public.exam_concepts (exam_id, concept_id, depth_required, importance, subject)
select e.id, c.id, 2, 'high', 'Science'
from public.exams e, public.concepts c
where e.slug = 'mp-police-constable' and c.slug = 'newtons-laws-of-motion'
on conflict (exam_id, concept_id) do nothing;

insert into public.exam_concepts (exam_id, concept_id, depth_required, importance, subject)
select e.id, c.id, 2, 'medium', 'General Knowledge & Reasoning'
from public.exams e, public.concepts c
where e.slug = 'mp-police-constable' and c.slug = 'fundamental-rights'
on conflict (exam_id, concept_id) do nothing;

insert into public.exam_concepts (exam_id, concept_id, depth_required, importance, subject)
select e.id, c.id, 2, 'medium', 'General Knowledge & Reasoning'
from public.exams e, public.concepts c
where e.slug = 'mp-police-constable' and c.slug = 'indian-parliament'
on conflict (exam_id, concept_id) do nothing;

-- ============================================
-- RELATED EXAMS
-- ============================================

insert into public.related_exams (exam_id_1, exam_id_2, relation_type)
select e1.id, e2.id, 'similar'
from public.exams e1, public.exams e2
where e1.slug = 'rrb-group-d' and e2.slug = 'ssc-gd'
on conflict do nothing;

insert into public.related_exams (exam_id_1, exam_id_2, relation_type)
select e1.id, e2.id, 'similar'
from public.exams e1, public.exams e2
where e1.slug = 'rrb-group-d' and e2.slug = 'mp-police-constable'
on conflict do nothing;

insert into public.related_exams (exam_id_1, exam_id_2, relation_type)
select e1.id, e2.id, 'similar'
from public.exams e1, public.exams e2
where e1.slug = 'ssc-gd' and e2.slug = 'mp-police-constable'
on conflict do nothing;
