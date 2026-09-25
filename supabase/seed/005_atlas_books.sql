-- ============================================
-- Seed Data: Atlas Books + Sample Solutions
-- ============================================
-- For Session 8: Books solutions SEO demo
-- Books: NCERT Class 8-10 Science + Math + Senior Physics

-- ============================================
-- BOOKS
-- ============================================

insert into public.books (slug, title, author, publisher, edition, segment, subject, class_ref, board_ref, description, seo_json, status)
values
(
  'ncert-class-8-science',
  'NCERT Science - Class 8',
  'NCERT',
  'National Council of Educational Research and Training',
  'Latest Edition',
  'school',
  'Science',
  'Class 8',
  'CBSE',
  'NCERT Science textbook for Class 8. Covers Crop Production, Microorganisms, Synthetic Fibres, Metals, Coal, Combustion, Conservation, Cell Structure, Reproduction, Adolescence, Force, Friction, Sound, Light, Solar System, Pollution, and more.',
  jsonb_build_object(
    'title', 'NCERT Class 8 Science Solutions — Chapter-wise Answers',
    'description', 'Free NCERT Class 8 Science solutions. Chapter-wise answers with explanations for all exercises.',
    'indexable', true,
    'keywords', jsonb_build_array('ncert class 8 science', 'class 8 science solutions', 'cbse class 8 science')
  ),
  'active'
) on conflict (slug) do nothing;

insert into public.books (slug, title, author, publisher, edition, segment, subject, class_ref, board_ref, description, seo_json, status)
values
(
  'ncert-class-10-science',
  'NCERT Science - Class 10',
  'NCERT',
  'National Council of Educational Research and Training',
  'Latest Edition',
  'school',
  'Science',
  'Class 10',
  'CBSE',
  'NCERT Science textbook for Class 10. Covers Chemical Reactions, Acids & Bases, Metals, Carbon, Life Processes, Control & Coordination, Reproduction, Heredity, Light, Human Eye, Electricity, Magnetic Effects, Environment, Resources.',
  jsonb_build_object(
    'title', 'NCERT Class 10 Science Solutions — Chapter-wise Answers',
    'description', 'Free NCERT Class 10 Science solutions. Chapter-wise answers with explanations for all exercises.',
    'indexable', true,
    'keywords', jsonb_build_array('ncert class 10 science', 'class 10 science solutions', 'cbse class 10 science')
  ),
  'active'
) on conflict (slug) do nothing;

insert into public.books (slug, title, author, publisher, edition, segment, subject, class_ref, board_ref, description, seo_json, status)
values
(
  'ncert-class-10-mathematics',
  'NCERT Mathematics - Class 10',
  'NCERT',
  'National Council of Educational Research and Training',
  'Latest Edition',
  'school',
  'Mathematics',
  'Class 10',
  'CBSE',
  'NCERT Mathematics textbook for Class 10. Covers Real Numbers, Polynomials, Linear Equations, Quadratic Equations, Arithmetic Progressions, Triangles, Coordinate Geometry, Trigonometry, Applications, Circles, Areas, Surface Areas, Volumes, Statistics, Probability.',
  jsonb_build_object(
    'title', 'NCERT Class 10 Math Solutions — Chapter-wise Answers',
    'description', 'Free NCERT Class 10 Math solutions. Chapter-wise answers with step-by-step explanations.',
    'indexable', true,
    'keywords', jsonb_build_array('ncert class 10 math', 'class 10 math solutions', 'cbse class 10 maths')
  ),
  'active'
) on conflict (slug) do nothing;

insert into public.books (slug, title, author, publisher, edition, segment, subject, class_ref, board_ref, description, seo_json, status)
values
(
  'ncert-class-12-physics',
  'NCERT Physics - Class 12 (Part 1)',
  'NCERT',
  'National Council of Educational Research and Training',
  'Latest Edition',
  'senior',
  'Physics',
  'Class 12',
  'CBSE',
  'NCERT Physics textbook for Class 12 Part 1. Covers Electrostatics, Current Electricity, Magnetic Effects, Electromagnetic Induction, Alternating Current, Electromagnetic Waves.',
  jsonb_build_object(
    'title', 'NCERT Class 12 Physics Solutions — Chapter-wise Answers',
    'description', 'Free NCERT Class 12 Physics solutions. Chapter-wise answers with step-by-step explanations.',
    'indexable', true,
    'keywords', jsonb_build_array('ncert class 12 physics', 'class 12 physics solutions', 'cbse class 12 physics')
  ),
  'active'
) on conflict (slug) do nothing;

-- ============================================
-- BOOK CHAPTERS
-- ============================================

-- NCERT Class 8 Science chapters
insert into public.book_chapters (book_id, chapter_number, title, slug, summary, seo_json)
select id, 1, 'Crop Production and Management', 'crop-production-and-management',
  'Agricultural practices, crop rotation, irrigation, and modern farming techniques.',
  jsonb_build_object(
    'title', 'NCERT Class 8 Science Chapter 1 - Crop Production and Management Solutions',
    'description', 'NCERT Class 8 Science Chapter 1 solutions: Crop Production and Management. Step-by-step answers.',
    'indexable', true
  )
from public.books where slug = 'ncert-class-8-science'
on conflict (book_id, chapter_number) do nothing;

insert into public.book_chapters (book_id, chapter_number, title, slug, summary, seo_json)
select id, 2, 'Microorganisms: Friend and Foe', 'microorganisms-friend-and-foe',
  'Types of microorganisms, their benefits and harmful effects, food preservation.',
  jsonb_build_object('title', 'NCERT Class 8 Science Chapter 2 - Microorganisms Solutions', 'description', 'NCERT Class 8 Science Chapter 2 solutions.', 'indexable', true)
from public.books where slug = 'ncert-class-8-science'
on conflict (book_id, chapter_number) do nothing;

insert into public.book_chapters (book_id, chapter_number, title, slug, summary, seo_json)
select id, 11, 'Force and Pressure', 'force-and-pressure',
  'Force, types of force, pressure, and their applications in daily life.',
  jsonb_build_object('title', 'NCERT Class 8 Science Chapter 11 - Force and Pressure Solutions', 'description', 'NCERT Class 8 Science Chapter 11 solutions.', 'indexable', true)
from public.books where slug = 'ncert-class-8-science'
on conflict (book_id, chapter_number) do nothing;

-- NCERT Class 10 Science chapters
insert into public.book_chapters (book_id, chapter_number, title, slug, summary, seo_json)
select id, 1, 'Chemical Reactions and Equations', 'chemical-reactions-and-equations',
  'Chemical reactions, balancing equations, types of reactions, oxidation and reduction.',
  jsonb_build_object('title', 'NCERT Class 10 Science Chapter 1 - Chemical Reactions Solutions', 'description', 'NCERT Class 10 Science Chapter 1 solutions.', 'indexable', true)
from public.books where slug = 'ncert-class-10-science'
on conflict (book_id, chapter_number) do nothing;

insert into public.book_chapters (book_id, chapter_number, title, slug, summary, seo_json)
select id, 6, 'Life Processes', 'life-processes',
  'Nutrition, respiration, transportation, excretion in living organisms.',
  jsonb_build_object('title', 'NCERT Class 10 Science Chapter 6 - Life Processes Solutions', 'description', 'NCERT Class 10 Science Chapter 6 solutions: Life Processes.', 'indexable', true)
from public.books where slug = 'ncert-class-10-science'
on conflict (book_id, chapter_number) do nothing;

insert into public.book_chapters (book_id, chapter_number, title, slug, summary, seo_json)
select id, 10, 'Light - Reflection and Refraction', 'light-reflection-and-refraction',
  'Reflection, refraction, mirrors, lenses, and optical instruments.',
  jsonb_build_object('title', 'NCERT Class 10 Science Chapter 10 - Light Solutions', 'description', 'NCERT Class 10 Science Chapter 10 solutions: Light.', 'indexable', true)
from public.books where slug = 'ncert-class-10-science'
on conflict (book_id, chapter_number) do nothing;

-- NCERT Class 10 Math chapters
insert into public.book_chapters (book_id, chapter_number, title, slug, summary, seo_json)
select id, 1, 'Real Numbers', 'real-numbers',
  'Euclid''s division lemma, fundamental theorem of arithmetic, irrational numbers.',
  jsonb_build_object('title', 'NCERT Class 10 Math Chapter 1 - Real Numbers Solutions', 'description', 'NCERT Class 10 Math Chapter 1 solutions.', 'indexable', true)
from public.books where slug = 'ncert-class-10-mathematics'
on conflict (book_id, chapter_number) do nothing;

insert into public.book_chapters (book_id, chapter_number, title, slug, summary, seo_json)
select id, 6, 'Triangles', 'triangles',
  'Similarity of triangles, Pythagoras theorem, and related concepts.',
  jsonb_build_object('title', 'NCERT Class 10 Math Chapter 6 - Triangles Solutions', 'description', 'NCERT Class 10 Math Chapter 6 solutions: Triangles.', 'indexable', true)
from public.books where slug = 'ncert-class-10-mathematics'
on conflict (book_id, chapter_number) do nothing;

-- NCERT Class 12 Physics chapters
insert into public.book_chapters (book_id, chapter_number, title, slug, summary, seo_json)
select id, 1, 'Electric Charges and Fields', 'electric-charges-and-fields',
  'Electric charge, Coulomb''s law, electric field, Gauss''s law.',
  jsonb_build_object('title', 'NCERT Class 12 Physics Chapter 1 - Electric Charges Solutions', 'description', 'NCERT Class 12 Physics Chapter 1 solutions.', 'indexable', true)
from public.books where slug = 'ncert-class-12-physics'
on conflict (book_id, chapter_number) do nothing;

-- ============================================
-- BOOK SOLUTIONS (sample)
-- ============================================

-- Class 8 Science Chapter 1 - Q1
insert into public.book_solutions (chapter_id, question_number, question_text, solution_text, concept_id, difficulty, marks, seo_json)
select c.id, '1',
  'Select the correct word from the following list and fill in the blanks: (a) The same kind of plants grown and cultivated on a large scale at a place is called ________.',
  '**Answer: crop**

**Explanation:**
A crop is a group of the same kind of plants grown and cultivated on a large scale at a place. Examples:
- **Kharif crops:** Paddy, maize, soyabean (grown in rainy season, June-October)
- **Rabi crops:** Wheat, gram, pea (grown in winter season, November-April)

Crops are cultivated systematically to ensure maximum yield and quality.',
  null, 1, 1,
  jsonb_build_object('title', 'NCERT Class 8 Science Chapter 1 Q1 Solution', 'indexable', true)
from public.book_chapters c
join public.books b on c.book_id = b.id
where b.slug = 'ncert-class-8-science' and c.chapter_number = 1
on conflict do nothing;

-- Class 8 Science Chapter 1 - Q2
insert into public.book_solutions (chapter_id, question_number, question_text, solution_text, concept_id, difficulty, marks, seo_json)
select c.id, '2',
  'What are the basic practices of crop production?',
  '**Answer:**
The basic practices of crop production are:

1. **Preparation of soil:** Tilling and loosening the soil for better aeration
2. **Sowing:** Planting seeds at proper depth and distance
3. **Adding manure and fertilizers:** Providing nutrients to the soil
4. **Irrigation:** Supplying water to crops at regular intervals
5. **Protecting from weeds:** Removing unwanted plants (weedicides like 2,4-D)
6. **Harvesting:** Cutting and gathering mature crops
7. **Storage:** Storing grains with proper moisture control and protection from pests

These practices ensure healthy crop growth and maximum yield.',
  null, 2, 3,
  jsonb_build_object('title', 'NCERT Class 8 Science Chapter 1 Q2 Solution', 'indexable', true)
from public.book_chapters c
join public.books b on c.book_id = b.id
where b.slug = 'ncert-class-8-science' and c.chapter_number = 1
on conflict do nothing;

-- Class 10 Science Chapter 6 - Q1 (Photosynthesis - linked to concept)
insert into public.book_solutions (chapter_id, question_number, question_text, solution_text, concept_id, difficulty, marks, seo_json)
select c.id, '1',
  'Why is diffusion insufficient to meet the oxygen requirements of multicellular organisms like humans?',
  '**Answer:**
In multicellular organisms like humans, all body cells are not in direct contact with the environment. Diffusion alone cannot deliver oxygen to cells deep inside the body because:

1. **Distance:** Diffusion is too slow for gases to travel long distances within the body
2. **Volume:** Multicellular organisms have large volume, so surface area to volume ratio is low
3. **Demand:** Cells need continuous oxygen supply for respiration

**Solution:** Multicellular organisms have specialized tissues and organs:
- **Respiratory system:** Lungs/trachea for oxygen intake
- **Circulatory system:** Blood (hemoglobin) transports oxygen to every cell

This ensures efficient oxygen delivery to all cells.',
  con.id, 2, 2,
  jsonb_build_object('title', 'NCERT Class 10 Science Chapter 6 Q1 Solution - Life Processes', 'indexable', true)
from public.book_chapters c
join public.books b on c.book_id = b.id
left join public.concepts con on con.slug = 'photosynthesis'
where b.slug = 'ncert-class-10-science' and c.chapter_number = 6
on conflict do nothing;

-- Class 10 Science Chapter 6 - Q2 (Photosynthesis - linked to concept)
insert into public.book_solutions (chapter_id, question_number, question_text, solution_text, concept_id, difficulty, marks, seo_json)
select c.id, '2',
  'What are the differences between autotrophic and heterotrophic nutrition?',
  '**Answer:**

| Feature | Autotrophic Nutrition | Heterotrophic Nutrition |
|---------|----------------------|------------------------|
| Food source | Self-synthesizes food from inorganic substances | Depends on other organisms for food |
| Energy source | Sunlight (photosynthesis) | Chemical energy from food |
| Chlorophyll | Present | Absent |
| Examples | Green plants, algae, some bacteria | Animals, fungi, most bacteria |

**Autotrophic nutrition** involves photosynthesis:
```
6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂
```

**Heterotrophic nutrition** has 3 types:
1. **Saprophytic:** On dead matter (fungi)
2. **Parasitic:** On living host (tapeworm)
3. **Holozoic:** Ingestion + digestion (humans)',
  con.id, 2, 3,
  jsonb_build_object('title', 'NCERT Class 10 Science Chapter 6 Q2 - Autotrophic vs Heterotrophic', 'indexable', true)
from public.book_chapters c
join public.books b on c.book_id = b.id
left join public.concepts con on con.slug = 'photosynthesis'
where b.slug = 'ncert-class-10-science' and c.chapter_number = 6
on conflict do nothing;

-- Class 10 Math Chapter 6 - Q1 (Pythagoras - linked to concept)
insert into public.book_solutions (chapter_id, question_number, question_text, solution_text, concept_id, difficulty, marks, seo_json)
select c.id, '1',
  'Fill in the blanks using the correct word given in brackets: (i) All circles are ________ (congruent, similar)',
  '**Answer: similar**

**Explanation:**
All circles are **similar** because:
1. They have the same shape (round)
2. The ratio of their corresponding parts (radius, diameter, circumference) is constant
3. They may have different sizes, but their shape is identical

All circles are NOT congruent because congruent figures must have the same size.

**Note:** Two figures are similar if they have the same shape but not necessarily the same size. They are congruent if they have both the same shape AND the same size.',
  con.id, 1, 1,
  jsonb_build_object('title', 'NCERT Class 10 Math Chapter 6 Q1 - Triangles', 'indexable', true)
from public.book_chapters c
join public.books b on c.book_id = b.id
left join public.concepts con on con.slug = 'pythagoras-theorem'
where b.slug = 'ncert-class-10-mathematics' and c.chapter_number = 6
on conflict do nothing;

-- Class 10 Math Chapter 6 - Q2 (Pythagoras - linked to concept)
insert into public.book_solutions (chapter_id, question_number, question_text, solution_text, concept_id, difficulty, marks, seo_json)
select c.id, '2',
  'In a right triangle ABC, right-angled at B, if AB = 6 cm and BC = 8 cm, find AC.',
  '**Answer: AC = 10 cm**

**Solution:**
Given: Right triangle ABC with right angle at B
- AB = 6 cm (one leg)
- BC = 8 cm (other leg)
- AC = ? (hypotenuse)

Using Pythagoras theorem:
```
AC² = AB² + BC²
AC² = 6² + 8²
AC² = 36 + 64
AC² = 100
AC = √100
AC = 10 cm
```

**Verification:** (6, 8, 10) is a Pythagorean triple (multiple of 3, 4, 5).

**Note:** Pythagoras theorem states that in a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c².',
  con.id, 2, 2,
  jsonb_build_object('title', 'NCERT Class 10 Math Chapter 6 Q2 - Pythagoras Theorem Solution', 'indexable', true)
from public.book_chapters c
join public.books b on c.book_id = b.id
left join public.concepts con on con.slug = 'pythagoras-theorem'
where b.slug = 'ncert-class-10-mathematics' and c.chapter_number = 6
on conflict do nothing;

-- Class 8 Science Chapter 11 - Q1 (Newton's Laws - linked to concept)
insert into public.book_solutions (chapter_id, question_number, question_text, solution_text, concept_id, difficulty, marks, seo_json)
select c.id, '1',
  'Give two examples of situations in which force changes the shape of an object.',
  '**Answer:**

**Example 1: Stretching a rubber band**
When you pull a rubber band, the force stretches it from its original shape. The rubber band elongates.

**Example 2: Squeezing a sponge**
When you press a sponge, the force changes its shape — it compresses.

**Other examples:**
- Kneading dough
- Crushing a paper cup
- Bending a metal wire

**Key concept:** Force can change:
1. **Shape** of an object (as above)
2. **Speed** (accelerate or decelerate)
3. **Direction** of motion
4. **State of rest/motion** (start or stop movement)',
  con.id, 1, 1,
  jsonb_build_object('title', 'NCERT Class 8 Science Chapter 11 Q1 - Force and Pressure', 'indexable', true)
from public.book_chapters c
join public.books b on c.book_id = b.id
left join public.concepts con on con.slug = 'newtons-laws-of-motion'
where b.slug = 'ncert-class-8-science' and c.chapter_number = 11
on conflict do nothing;
