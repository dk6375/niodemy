-- ============================================
-- Seed Data: CBSE Class 8 + Class 8 NEET Foundation curriculums
-- ============================================
-- For Session 3 demo: depth-merge combined course engine

-- ============================================
-- BOARD + CLASS
-- ============================================

insert into public.boards (name, slug, full_name)
values ('CBSE', 'cbse', 'Central Board of Secondary Education')
on conflict (slug) do nothing;

insert into public.classes (board_id, name, level, segment)
select id, 'Class 8', 8, 'school' from public.boards where slug = 'cbse'
on conflict (board_id, name) do nothing;

-- ============================================
-- CURRICULUMS (Class 8 CBSE Science + Class 8 NEET Foundation Science)
-- ============================================

-- Class 8 CBSE Science (academic year 2025-26)
insert into public.curriculums (board_id, class_id, subject, academic_year, status)
select b.id, c.id, 'Science', '2025-26', 'active'
from public.boards b, public.classes c
where b.slug = 'cbse' and c.name = 'Class 8'
on conflict (board_id, class_id, subject, academic_year) do nothing;

-- Class 8 NEET Foundation Science (same CBSE Class 8, but foundation depth)
insert into public.curriculums (board_id, class_id, subject, academic_year, status)
select b.id, c.id, 'NEET Foundation Science', '2025-26', 'active'
from public.boards b, public.classes c
where b.slug = 'cbse' and c.name = 'Class 8'
on conflict (board_id, class_id, subject, academic_year) do nothing;

-- ============================================
-- CURRICULUM CONCEPTS (map existing concepts to both curriculums at different depths)
-- ============================================
-- Existing concepts: photosynthesis, fundamental-rights, pythagoras-theorem, newtons-laws-of-motion, indian-parliament
-- We'll map the science ones (photosynthesis, newtons-laws-of-motion) to both curriculums.

-- Class 8 CBSE Science: basic depth (L2)
insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 2, 'high', 'Crop Production and Management', 1
from public.curriculums cur, public.concepts con
where cur.subject = 'Science' and cur.academic_year = '2025-26'
  and con.slug = 'photosynthesis'
on conflict (curriculum_id, concept_id) do nothing;

insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 2, 'high', 'Force and Pressure', 2
from public.curriculums cur, public.concepts con
where cur.subject = 'Science' and cur.academic_year = '2025-26'
  and con.slug = 'newtons-laws-of-motion'
on conflict (curriculum_id, concept_id) do nothing;

-- Class 8 NEET Foundation Science: deeper depth (L3) for the SAME concepts
insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 3, 'high', 'Foundation: Plant Physiology', 1
from public.curriculums cur, public.concepts con
where cur.subject = 'NEET Foundation Science' and cur.academic_year = '2025-26'
  and con.slug = 'photosynthesis'
on conflict (curriculum_id, concept_id) do nothing;

insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 3, 'high', 'Foundation: Mechanics', 2
from public.curriculums cur, public.concepts con
where cur.subject = 'NEET Foundation Science' and cur.academic_year = '2025-26'
  and con.slug = 'newtons-laws-of-motion'
on conflict (curriculum_id, concept_id) do nothing;
