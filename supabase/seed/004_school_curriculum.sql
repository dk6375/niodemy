-- ============================================
-- Seed Data: Full CBSE Class 6-10 curriculum
-- ============================================
-- For Session 7: School segment build

-- ============================================
-- CLASSES 6, 7, 9, 10 (Class 8 already exists)
-- ============================================

insert into public.classes (board_id, name, level, segment)
select id, 'Class 6', 6, 'school' from public.boards where slug = 'cbse'
on conflict (board_id, name) do nothing;

insert into public.classes (board_id, name, level, segment)
select id, 'Class 7', 7, 'school' from public.boards where slug = 'cbse'
on conflict (board_id, name) do nothing;

insert into public.classes (board_id, name, level, segment)
select id, 'Class 9', 9, 'school' from public.boards where slug = 'cbse'
on conflict (board_id, name) do nothing;

insert into public.classes (board_id, name, level, segment)
select id, 'Class 10', 10, 'school' from public.boards where slug = 'cbse'
on conflict (board_id, name) do nothing;

-- ============================================
-- NEW CONCEPTS (more variety for school)
-- ============================================

-- Human Heart (Biology - Class 8/10)
insert into public.concepts (slug, title, subject, domain, summary, content_json, depth_layers, status, seo_json)
values
(
  'human-heart',
  'Human Heart',
  'Biology',
  'Science',
  'The human heart is a muscular organ that pumps blood throughout the body via the circulatory system.',
  jsonb_build_object(
    'definition', 'The heart is a muscular organ that pumps blood through the blood vessels of the circulatory system.',
    'key_facts', jsonb_build_array(
      'Four chambers: 2 atria (upper) + 2 ventricles (lower)',
      'Size: roughly a closed fist',
      'Beats ~72 times per minute at rest',
      'Pumps ~5 liters of blood per minute',
      'Right side: deoxygenated blood; Left side: oxygenated blood'
    ),
    'components', jsonb_build_array(
      jsonb_build_object('name', 'Right Atrium', 'desc', 'Receives deoxygenated blood from body'),
      jsonb_build_object('name', 'Right Ventricle', 'desc', 'Pumps blood to lungs'),
      jsonb_build_object('name', 'Left Atrium', 'desc', 'Receives oxygenated blood from lungs'),
      jsonb_build_object('name', 'Left Ventricle', 'desc', 'Pumps blood to body (thickest wall)')
    )
  ),
  jsonb_build_object(
    'L1', 'Heart pumps blood in our body.',
    'L2', '4 chambers (2 atria + 2 ventricles), 72 bpm, double circulation.',
    'L3', 'Cardiac cycle (systole/diastole), blood flow path, valves, electrical conduction (SA node, AV node).',
    'L4', 'ECG interpretation, cardiac output = SV × HR, Frank-Starling law, heart diseases.'
  ),
  'published',
  jsonb_build_object('title', 'Human Heart — Structure, Function, Chambers', 'description', 'Learn human heart: chambers, blood flow, cardiac cycle.', 'indexable', true)
) on conflict (slug) do nothing;

-- Motion (Physics - Class 9)
insert into public.concepts (slug, title, subject, domain, summary, content_json, depth_layers, status, seo_json)
values
(
  'motion',
  'Motion',
  'Physics',
  'Science',
  'Motion is the change in position of an object with respect to its surroundings over time.',
  jsonb_build_object(
    'definition', 'An object is in motion if its position changes with respect to a reference point over time.',
    'key_facts', jsonb_build_array(
      'Distance: total path length (scalar)',
      'Displacement: shortest path from start to end (vector)',
      'Speed = Distance / Time (scalar)',
      'Velocity = Displacement / Time (vector)',
      'Acceleration = Change in Velocity / Time'
    )
  ),
  jsonb_build_object(
    'L1', 'Motion means something is moving.',
    'L2', 'Distance, displacement, speed, velocity, acceleration. Formulas: v = d/t, a = Δv/t.',
    'L3', 'Equations of motion (v=u+at, s=ut+½at², v²=u²+2as), graphs (v-t, s-t), uniform vs non-uniform motion.',
    'L4', 'Relative motion, projectile motion, circular motion, derivation of equations via calculus.'
  ),
  'published',
  jsonb_build_object('title', 'Motion — Distance, Displacement, Speed, Velocity, Acceleration', 'description', 'Learn motion: formulas, equations, graphs.', 'indexable', true)
) on conflict (slug) do nothing;

-- Light - Reflection (Physics - Class 10)
insert into public.concepts (slug, title, subject, domain, summary, content_json, depth_layers, status, seo_json)
values
(
  'light-reflection',
  'Light - Reflection',
  'Physics',
  'Science',
  'Reflection is the bouncing back of light when it strikes a surface.',
  jsonb_build_object(
    'definition', 'Reflection is the phenomenon where light bounces back into the same medium after hitting a surface.',
    'key_facts', jsonb_build_array(
      'Laws of Reflection: (1) Angle of incidence = Angle of reflection, (2) Incident ray, reflected ray, normal lie in same plane',
      'Two types: Regular (smooth surface) and Diffuse (rough surface)',
      'Plane mirror: image is virtual, erect, same size, laterally inverted',
      'Spherical mirrors: Concave (converging) and Convex (diverging)',
      'Mirror formula: 1/f = 1/u + 1/v'
    )
  ),
  jsonb_build_object(
    'L1', 'Light bounces back from surfaces — that''s reflection.',
    'L2', 'Laws of reflection, plane mirror properties, types of reflection.',
    'L3', 'Spherical mirrors (concave/convex), mirror formula, magnification, ray diagrams, sign convention.',
    'L4', 'Parabolic mirrors, aberrations, applications in telescopes/satellite dishes, total internal reflection.'
  ),
  'published',
  jsonb_build_object('title', 'Light Reflection — Laws, Mirrors, Mirror Formula', 'description', 'Learn light reflection: laws, plane & spherical mirrors, formulas.', 'indexable', true)
) on conflict (slug) do nothing;

-- Number System (Math - Class 9)
insert into public.concepts (slug, title, subject, domain, summary, content_json, depth_layers, status, seo_json)
values
(
  'number-system',
  'Number System',
  'Mathematics',
  'Math',
  'The number system is a mathematical notation for representing numbers of a given set.',
  jsonb_build_object(
    'definition', 'A number system is a writing system for expressing numbers; a mathematical notation for representing numbers.',
    'key_facts', jsonb_build_array(
      'Natural numbers (N): 1, 2, 3, ...',
      'Whole numbers (W): 0, 1, 2, 3, ...',
      'Integers (Z): ..., -2, -1, 0, 1, 2, ...',
      'Rational numbers (Q): p/q where q ≠ 0',
      'Real numbers (R): rational + irrational numbers'
    )
  ),
  jsonb_build_object(
    'L1', 'Numbers we use to count and measure.',
    'L2', 'Types: Natural, Whole, Integers, Rational, Irrational, Real numbers.',
    'L3', 'Rational vs irrational, decimal expansions (terminating, non-terminating recurring, non-terminating non-recurring), representation on number line.',
    'L4', 'Field properties, completeness axiom, Cantor''s diagonal argument, complex numbers extension.'
  ),
  'published',
  jsonb_build_object('title', 'Number System — Natural, Whole, Integers, Rational, Real', 'description', 'Learn number system: types of numbers, properties.', 'indexable', true)
) on conflict (slug) do nothing;

-- Climate (Geography - Class 9)
insert into public.concepts (slug, title, subject, domain, summary, content_json, depth_layers, status, seo_json)
values
(
  'climate',
  'Climate',
  'Geography',
  'Social Science',
  'Climate refers to the long-term average of weather conditions of a place over a long period (usually 30+ years).',
  jsonb_build_object(
    'definition', 'Climate is the average weather conditions of a place over a long period (typically 30+ years).',
    'key_facts', jsonb_build_array(
      'Difference: Weather = short-term, Climate = long-term',
      'Factors: latitude, altitude, distance from sea, ocean currents, relief',
      'India has 4 major seasons: Winter, Summer, Monsoon, Post-monsoon',
      'Monsoon: seasonal reversal of winds',
      'Climatic zones: Torrid, Temperate, Frigid'
    )
  ),
  jsonb_build_object(
    'L1', 'Climate is the usual weather of a place over many years.',
    'L2', 'Difference from weather, factors affecting climate, Indian seasons.',
    'L3', 'Monsoon mechanism, climatic classification (Köppen), El Nino/La Nina, climate change.',
    'L4', 'Climate modeling, paleoclimatology, global circulation models, IPCC reports.'
  ),
  'published',
  jsonb_build_object('title', 'Climate — Factors, Indian Seasons, Monsoon', 'description', 'Learn climate: factors, monsoon, climatic zones.', 'indexable', true)
) on conflict (slug) do nothing;

-- Mughal Empire (History - Class 7)
insert into public.concepts (slug, title, subject, domain, summary, content_json, depth_layers, status, seo_json)
values
(
  'mughal-empire',
  'Mughal Empire',
  'History',
  'Social Science',
  'The Mughal Empire was a major empire in the Indian subcontinent from 1526 to 1857.',
  jsonb_build_object(
    'definition', 'The Mughal Empire ruled most of the Indian subcontinent from 1526 to 1857, founded by Babur.',
    'key_facts', jsonb_build_array(
      'Founded by Babur in 1526 (First Battle of Panipat)',
      'Major rulers: Babur, Humayun, Akbar, Jahangir, Shah Jahan, Aurangzeb',
      'Akbar: greatest ruler, religious tolerance, Din-i-Ilahi',
      'Shah Jahan: built Taj Mahal, Red Fort',
      'Decline started after Aurangzeb (1707)',
      'Ended in 1857 with Bahadur Shah Zafar (Sepoy Mutiny)'
    )
  ),
  jsonb_build_object(
    'L1', 'Mughals ruled India for about 300 years.',
    'L2', 'Founded 1526 by Babur, major rulers, key contributions, decline.',
    'L3', 'Administrative system (mansabdari), revenue system (zabt), religious policies, cultural achievements, architecture.',
    'L4', 'Historiography, economic impact, comparison with contemporary empires, causes of decline analysis.'
  ),
  'published',
  jsonb_build_object('title', 'Mughal Empire — Rulers, History, Contributions (1526-1857)', 'description', 'Learn Mughal Empire: Babur, Akbar, Shah Jahan, decline.', 'indexable', true)
) on conflict (slug) do nothing;

-- ============================================
-- CURRICULUMS for all classes
-- ============================================

-- Class 6 Science
insert into public.curriculums (board_id, class_id, subject, academic_year, status)
select b.id, c.id, 'Science', '2025-26', 'active'
from public.boards b, public.classes c
where b.slug = 'cbse' and c.name = 'Class 6'
on conflict (board_id, class_id, subject, academic_year) do nothing;

-- Class 6 Math
insert into public.curriculums (board_id, class_id, subject, academic_year, status)
select b.id, c.id, 'Mathematics', '2025-26', 'active'
from public.boards b, public.classes c
where b.slug = 'cbse' and c.name = 'Class 6'
on conflict (board_id, class_id, subject, academic_year) do nothing;

-- Class 7 Science
insert into public.curriculums (board_id, class_id, subject, academic_year, status)
select b.id, c.id, 'Science', '2025-26', 'active'
from public.boards b, public.classes c
where b.slug = 'cbse' and c.name = 'Class 7'
on conflict (board_id, class_id, subject, academic_year) do nothing;

-- Class 7 Social Science (History)
insert into public.curriculums (board_id, class_id, subject, academic_year, status)
select b.id, c.id, 'Social Science', '2025-26', 'active'
from public.boards b, public.classes c
where b.slug = 'cbse' and c.name = 'Class 7'
on conflict (board_id, class_id, subject, academic_year) do nothing;

-- Class 8 Mathematics
insert into public.curriculums (board_id, class_id, subject, academic_year, status)
select b.id, c.id, 'Mathematics', '2025-26', 'active'
from public.boards b, public.classes c
where b.slug = 'cbse' and c.name = 'Class 8'
on conflict (board_id, class_id, subject, academic_year) do nothing;

-- Class 8 Social Science
insert into public.curriculums (board_id, class_id, subject, academic_year, status)
select b.id, c.id, 'Social Science', '2025-26', 'active'
from public.boards b, public.classes c
where b.slug = 'cbse' and c.name = 'Class 8'
on conflict (board_id, class_id, subject, academic_year) do nothing;

-- Class 9 Science
insert into public.curriculums (board_id, class_id, subject, academic_year, status)
select b.id, c.id, 'Science', '2025-26', 'active'
from public.boards b, public.classes c
where b.slug = 'cbse' and c.name = 'Class 9'
on conflict (board_id, class_id, subject, academic_year) do nothing;

-- Class 9 Mathematics
insert into public.curriculums (board_id, class_id, subject, academic_year, status)
select b.id, c.id, 'Mathematics', '2025-26', 'active'
from public.boards b, public.classes c
where b.slug = 'cbse' and c.name = 'Class 9'
on conflict (board_id, class_id, subject, academic_year) do nothing;

-- Class 9 Social Science
insert into public.curriculums (board_id, class_id, subject, academic_year, status)
select b.id, c.id, 'Social Science', '2025-26', 'active'
from public.boards b, public.classes c
where b.slug = 'cbse' and c.name = 'Class 9'
on conflict (board_id, class_id, subject, academic_year) do nothing;

-- Class 10 Science
insert into public.curriculums (board_id, class_id, subject, academic_year, status)
select b.id, c.id, 'Science', '2025-26', 'active'
from public.boards b, public.classes c
where b.slug = 'cbse' and c.name = 'Class 10'
on conflict (board_id, class_id, subject, academic_year) do nothing;

-- Class 10 Mathematics
insert into public.curriculums (board_id, class_id, subject, academic_year, status)
select b.id, c.id, 'Mathematics', '2025-26', 'active'
from public.boards b, public.classes c
where b.slug = 'cbse' and c.name = 'Class 10'
on conflict (board_id, class_id, subject, academic_year) do nothing;

-- Class 10 Social Science
insert into public.curriculums (board_id, class_id, subject, academic_year, status)
select b.id, c.id, 'Social Science', '2025-26', 'active'
from public.boards b, public.classes c
where b.slug = 'cbse' and c.name = 'Class 10'
on conflict (board_id, class_id, subject, academic_year) do nothing;

-- ============================================
-- CURRICULUM-CONCEPT mappings
-- ============================================

-- Class 6 Science: Photosynthesis (basic, L1), Newton's Laws (L1)
insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 1, 'medium', 'Food and its Components', 1
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 6' and cur.class_id = c.id
  and con.slug = 'photosynthesis'
on conflict (curriculum_id, concept_id) do nothing;

insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 1, 'low', 'Force and Motion', 2
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 6' and cur.class_id = c.id
  and con.slug = 'newtons-laws-of-motion'
on conflict (curriculum_id, concept_id) do nothing;

-- Class 7 Science: Photosynthesis (L1), Human Heart (L1)
insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 1, 'high', 'Nutrition in Plants', 1
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 7' and cur.class_id = c.id
  and con.slug = 'photosynthesis'
on conflict (curriculum_id, concept_id) do nothing;

insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 1, 'medium', 'Body Movements', 2
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 7' and cur.class_id = c.id
  and con.slug = 'human-heart'
on conflict (curriculum_id, concept_id) do nothing;

-- Class 7 Social Science: Mughal Empire (L1)
insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 1, 'high', 'The Mughal Empire', 1
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Social Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 7' and cur.class_id = c.id
  and con.slug = 'mughal-empire'
on conflict (curriculum_id, concept_id) do nothing;

-- Class 8 Mathematics: Pythagoras Theorem (L2)
insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 2, 'high', 'Squares and Square Roots', 1
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Mathematics' and cur.academic_year = '2025-26'
  and c.name = 'Class 8' and cur.class_id = c.id
  and con.slug = 'pythagoras-theorem'
on conflict (curriculum_id, concept_id) do nothing;

-- Class 8 Social Science: Fundamental Rights (L2), Indian Parliament (L2)
insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 2, 'high', 'The Indian Constitution', 1
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Social Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 8' and cur.class_id = c.id
  and con.slug = 'fundamental-rights'
on conflict (curriculum_id, concept_id) do nothing;

insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 2, 'high', 'Why do we need a Parliament?', 2
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Social Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 8' and cur.class_id = c.id
  and con.slug = 'indian-parliament'
on conflict (curriculum_id, concept_id) do nothing;

-- Class 9 Science: Newton's Laws (L2), Motion (L2), Human Heart (L2)
insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 2, 'high', 'Force and Laws of Motion', 1
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 9' and cur.class_id = c.id
  and con.slug = 'newtons-laws-of-motion'
on conflict (curriculum_id, concept_id) do nothing;

insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 2, 'high', 'Motion', 2
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 9' and cur.class_id = c.id
  and con.slug = 'motion'
on conflict (curriculum_id, concept_id) do nothing;

insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 2, 'medium', 'Tissues', 3
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 9' and cur.class_id = c.id
  and con.slug = 'human-heart'
on conflict (curriculum_id, concept_id) do nothing;

-- Class 9 Mathematics: Number System (L2), Pythagoras Theorem (L2)
insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 2, 'high', 'Number Systems', 1
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Mathematics' and cur.academic_year = '2025-26'
  and c.name = 'Class 9' and cur.class_id = c.id
  and con.slug = 'number-system'
on conflict (curriculum_id, concept_id) do nothing;

insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 2, 'medium', 'Heron''s Formula', 2
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Mathematics' and cur.academic_year = '2025-26'
  and c.name = 'Class 9' and cur.class_id = c.id
  and con.slug = 'pythagoras-theorem'
on conflict (curriculum_id, concept_id) do nothing;

-- Class 9 Social Science: Climate (L2), Fundamental Rights (L2)
insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 2, 'high', 'Climate', 1
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Social Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 9' and cur.class_id = c.id
  and con.slug = 'climate'
on conflict (curriculum_id, concept_id) do nothing;

insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 2, 'high', 'Democratic Rights', 2
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Social Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 9' and cur.class_id = c.id
  and con.slug = 'fundamental-rights'
on conflict (curriculum_id, concept_id) do nothing;

-- Class 10 Science: Photosynthesis (L3), Light Reflection (L2), Human Heart (L3), Newton's Laws (L2)
insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 3, 'high', 'Life Processes', 1
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 10' and cur.class_id = c.id
  and con.slug = 'photosynthesis'
on conflict (curriculum_id, concept_id) do nothing;

insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 2, 'high', 'Light - Reflection and Refraction', 2
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 10' and cur.class_id = c.id
  and con.slug = 'light-reflection'
on conflict (curriculum_id, concept_id) do nothing;

insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 3, 'high', 'Life Processes', 3
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 10' and cur.class_id = c.id
  and con.slug = 'human-heart'
on conflict (curriculum_id, concept_id) do nothing;

insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 2, 'medium', 'Force and Laws of Motion', 4
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 10' and cur.class_id = c.id
  and con.slug = 'newtons-laws-of-motion'
on conflict (curriculum_id, concept_id) do nothing;

-- Class 10 Mathematics: Pythagoras Theorem (L3), Number System (L2)
insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 3, 'high', 'Triangles', 1
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Mathematics' and cur.academic_year = '2025-26'
  and c.name = 'Class 10' and cur.class_id = c.id
  and con.slug = 'pythagoras-theorem'
on conflict (curriculum_id, concept_id) do nothing;

insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 2, 'medium', 'Real Numbers', 2
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Mathematics' and cur.academic_year = '2025-26'
  and c.name = 'Class 10' and cur.class_id = c.id
  and con.slug = 'number-system'
on conflict (curriculum_id, concept_id) do nothing;

-- Class 10 Social Science: Fundamental Rights (L3), Indian Parliament (L3)
insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 3, 'high', 'Power Sharing & Federalism', 1
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Social Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 10' and cur.class_id = c.id
  and con.slug = 'fundamental-rights'
on conflict (curriculum_id, concept_id) do nothing;

insert into public.curriculum_concepts (curriculum_id, concept_id, depth_required, importance, chapter_name, order_index)
select cur.id, con.id, 3, 'high', 'Working of Institutions', 2
from public.curriculums cur, public.concepts con, public.classes c
where cur.subject = 'Social Science' and cur.academic_year = '2025-26'
  and c.name = 'Class 10' and cur.class_id = c.id
  and con.slug = 'indian-parliament'
on conflict (curriculum_id, concept_id) do nothing;
