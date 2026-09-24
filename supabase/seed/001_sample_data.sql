-- ============================================
-- Seed Data: Sample Concepts, Content, Questions (public schema)
-- ============================================
-- Used for Session 2 demo: W3Schools-style free browsing

-- ============================================
-- CONCEPTS (5 sample)
-- ============================================

insert into public.concepts (slug, title, subject, domain, summary, content_json, depth_layers, status, seo_json)
values
(
  'photosynthesis',
  'Photosynthesis',
  'Biology',
  'Science',
  'Photosynthesis is the process by which green plants and some organisms convert light energy into chemical energy stored in glucose.',
  jsonb_build_object(
    'definition', 'Photosynthesis is the process by which green plants use sunlight to synthesize food from carbon dioxide and water.',
    'key_facts', jsonb_build_array(
      'Occurs in chloroplasts',
      'Equation: 6CO2 + 6H2O + light → C6H12O6 + 6O2',
      'Two phases: Light reaction and Dark reaction (Calvin cycle)',
      'Chlorophyll is the main pigment',
      'Takes place mainly in leaves'
    ),
    'components', jsonb_build_array(
      jsonb_build_object('name', 'Chlorophyll', 'desc', 'Green pigment that absorbs light'),
      jsonb_build_object('name', 'Stomata', 'desc', 'Pores for gas exchange'),
      jsonb_build_object('name', 'Chloroplast', 'desc', 'Organelle where photosynthesis occurs')
    )
  ),
  jsonb_build_object(
    'L1', 'Plants make their own food using sunlight.',
    'L2', 'Photosynthesis converts light energy into chemical energy. Equation: 6CO2 + 6H2O → C6H12O6 + 6O2.',
    'L3', 'Two phases: Light reaction (in thylakoids, produces ATP & NADPH) and Calvin cycle (in stroma, fixes CO2 into glucose).',
    'L4', 'Detailed biochemistry: Photosystems I & II, electron transport chain, C3/C4/CAM pathways, photorespiration, factors affecting rate (light intensity, CO2 concentration, temperature).'
  ),
  'published',
  jsonb_build_object(
    'title', 'Photosynthesis — Process, Equation, Factors',
    'description', 'Learn photosynthesis: definition, equation, light & dark reactions, factors. With MCQs and practice questions.',
    'indexable', true
  )
) on conflict (slug) do nothing;

insert into public.concepts (slug, title, subject, domain, summary, content_json, depth_layers, status, seo_json)
values
(
  'fundamental-rights',
  'Fundamental Rights',
  'Polity',
  'Social Science',
  'Fundamental Rights are the basic human freedoms guaranteed to all citizens of India by the Constitution (Part III, Articles 12-35).',
  jsonb_build_object(
    'definition', 'Fundamental Rights are the essential human freedoms recognized by the Indian Constitution under Part III (Articles 12 to 35).',
    'key_facts', jsonb_build_array(
      'Part III of Constitution (Articles 12-35)',
      '6 categories of Fundamental Rights',
      'Article 32: Right to Constitutional Remedies (Dr. Ambedkar called it the heart and soul)',
      'Fundamental Rights are justiciable (enforceable by courts)',
      'Can be suspended during Emergency (except Articles 20 & 21)'
    ),
    'categories', jsonb_build_array(
      jsonb_build_object('name', 'Right to Equality', 'articles', '14-18'),
      jsonb_build_object('name', 'Right to Freedom', 'articles', '19-22'),
      jsonb_build_object('name', 'Right against Exploitation', 'articles', '23-24'),
      jsonb_build_object('name', 'Right to Freedom of Religion', 'articles', '25-28'),
      jsonb_build_object('name', 'Cultural & Educational Rights', 'articles', '29-30'),
      jsonb_build_object('name', 'Right to Constitutional Remedies', 'articles', '32')
    )
  ),
  jsonb_build_object(
    'L1', 'Fundamental Rights are the basic freedoms guaranteed to all Indians.',
    'L2', '6 categories: Equality, Freedom, against Exploitation, Freedom of Religion, Cultural & Educational, Constitutional Remedies.',
    'L3', 'Article 14-18 Equality, 19-22 Freedom, 23-24 Exploitation, 25-28 Religion, 29-30 Cultural, 32 Remedies. Justiciable, can be suspended during Emergency.',
    'L4', 'Detailed judicial interpretation: Maneka Gandhi case expanded Article 21 scope, Kesavananda Bharati, reasonable restrictions under Article 19, preventive detention safeguards.'
  ),
  'published',
  jsonb_build_object(
    'title', 'Fundamental Rights — Indian Constitution (Articles 12-35)',
    'description', 'Learn Fundamental Rights: 6 categories, articles, exceptions, important cases. With MCQs and PYQs.',
    'indexable', true
  )
) on conflict (slug) do nothing;

insert into public.concepts (slug, title, subject, domain, summary, content_json, depth_layers, status, seo_json)
values
(
  'pythagoras-theorem',
  'Pythagoras Theorem',
  'Mathematics',
  'Math',
  'In a right-angled triangle, the square of the hypotenuse equals the sum of squares of the other two sides.',
  jsonb_build_object(
    'definition', 'In a right triangle, the square of the hypotenuse (longest side) equals the sum of squares of the other two sides: a² + b² = c².',
    'key_facts', jsonb_build_array(
      'Formula: a² + b² = c²',
      'Applies only to right-angled triangles',
      'c is the hypotenuse (longest side, opposite to 90°)',
      'Converse: if a² + b² = c² holds, the triangle is right-angled',
      'Pythagorean triples: (3,4,5), (5,12,13), (8,15,17)'
    )
  ),
  jsonb_build_object(
    'L1', 'In a right triangle: a² + b² = c²',
    'L2', 'Formula and basic applications: finding hypotenuse, checking if triangle is right-angled.',
    'L3', 'Proofs (Bhaskara, Euclid), Pythagorean triples, applications in distance, coordinate geometry.',
    'L4', 'Generalization to n-dimensional spaces, irrationality of √2 proof, relation to law of cosines.'
  ),
  'published',
  jsonb_build_object(
    'title', 'Pythagoras Theorem — Formula, Proof, Examples',
    'description', 'Learn Pythagoras theorem: formula a²+b²=c², proofs, examples, MCQs.',
    'indexable', true
  )
) on conflict (slug) do nothing;

insert into public.concepts (slug, title, subject, domain, summary, content_json, depth_layers, status, seo_json)
values
(
  'newtons-laws-of-motion',
  'Newton''s Laws of Motion',
  'Physics',
  'Science',
  'Three fundamental laws that describe the relationship between a body and the forces acting on it.',
  jsonb_build_object(
    'definition', 'Newton formulated three laws that describe the motion of objects and the forces acting on them.',
    'key_facts', jsonb_build_array(
      'First Law (Law of Inertia): An object stays at rest or in motion unless acted on by external force',
      'Second Law: F = ma (Force = mass × acceleration)',
      'Third Law: Every action has an equal and opposite reaction',
      'Published in Principia Mathematica (1687)',
      'Foundation of classical mechanics'
    )
  ),
  jsonb_build_object(
    'L1', 'Three laws: things stay still unless pushed; force = mass × acceleration; action = reaction.',
    'L2', 'First Law (Inertia), Second Law (F=ma), Third Law (Action-Reaction). Basic applications.',
    'L3', 'Mathematical formulation, momentum conservation, types of forces, friction, free body diagrams.',
    'L4', 'Limitations at relativistic speeds, relation to conservation laws, Lagrangian/Hamiltonian mechanics.'
  ),
  'published',
  jsonb_build_object(
    'title', 'Newton''s Laws of Motion — First, Second, Third Law',
    'description', 'Learn Newton''s three laws of motion with examples, formulas, MCQs.',
    'indexable', true
  )
) on conflict (slug) do nothing;

insert into public.concepts (slug, title, subject, domain, summary, content_json, depth_layers, status, seo_json)
values
(
  'indian-parliament',
  'Indian Parliament',
  'Polity',
  'Social Science',
  'The Parliament of India is the supreme legislative body, consisting of the President and two houses: Lok Sabha and Rajya Sabha.',
  jsonb_build_object(
    'definition', 'The Parliament of India is the supreme legislative body, consisting of the President, Lok Sabha (Lower House) and Rajya Sabha (Upper House).',
    'key_facts', jsonb_build_array(
      'Article 79: Parliament = President + Lok Sabha + Rajya Sabha',
      'Lok Sabha: 543 members + 2 Anglo-Indian (suspended), 5-year term',
      'Rajya Sabha: 245 members, permanent body (1/3 retires every 2 years), 6-year term',
      'Maximum gap between sessions: 6 months',
      '3 types of bills: Ordinary, Money, Constitutional Amendment'
    )
  ),
  jsonb_build_object(
    'L1', 'Parliament makes laws. It has Lok Sabha and Rajya Sabha.',
    'L2', 'Article 79. Lok Sabha (543 members, 5 yr), Rajya Sabha (245 members, 6 yr, permanent).',
    'L3', 'Powers: legislative, executive (control over council of ministers), financial, constituent. Types of bills, passage process.',
    'L4', 'Parliamentary privileges, anti-defection law (10th Schedule), committees system, comparison with US Congress, parliamentary reforms needed.'
  ),
  'published',
  jsonb_build_object(
    'title', 'Indian Parliament — Lok Sabha, Rajya Sabha, Articles 79-122',
    'description', 'Learn Indian Parliament: structure, powers, bills, articles. With MCQs.',
    'indexable', true
  )
) on conflict (slug) do nothing;

-- ============================================
-- CONTENT (sample lessons for each concept)
-- ============================================

insert into public.content_assets (type, title, slug, body_md, concept_id, segment, status, seo_json)
select 'lesson', 'Photosynthesis — Complete Lesson', 'lesson-photosynthesis',
'# Photosynthesis

## What is Photosynthesis?

Photosynthesis is the process by which **green plants** convert light energy into chemical energy stored in glucose.

## The Equation

```
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂
```

## Two Phases

### 1. Light Reaction (in thylakoids)
- Absorbs light via chlorophyll
- Splits water (H₂O → H + O)
- Produces ATP and NADPH
- Releases oxygen

### 2. Dark Reaction / Calvin Cycle (in stroma)
- Uses ATP and NADPH from light reaction
- Fixes CO₂ into glucose
- Does not require light directly

## Key Components
- **Chlorophyll**: Green pigment that absorbs light
- **Stomata**: Pores for gas exchange
- **Chloroplast**: Organelle where photosynthesis occurs

## Factors Affecting Photosynthesis
1. Light intensity
2. CO₂ concentration
3. Temperature
4. Water availability
5. Chlorophyll content

> Photosynthesis is the foundation of all life on Earth — it produces oxygen and food that sustains ecosystems.',
  c.id, 'school', 'published',
  jsonb_build_object('title', 'Photosynthesis — Complete Lesson', 'description', 'Complete lesson on photosynthesis with equation, phases, factors.', 'indexable', true)
from public.concepts c where c.slug = 'photosynthesis'
on conflict (slug) do nothing;

insert into public.content_assets (type, title, slug, body_md, concept_id, segment, status, seo_json)
select 'lesson', 'Fundamental Rights — Complete Lesson', 'lesson-fundamental-rights',
'# Fundamental Rights

## What are Fundamental Rights?

Fundamental Rights are the **basic human freedoms** guaranteed to all citizens by the Indian Constitution under **Part III (Articles 12–35)**.

## 6 Categories of Fundamental Rights

| # | Right | Articles |
|---|-------|----------|
| 1 | Right to Equality | 14–18 |
| 2 | Right to Freedom | 19–22 |
| 3 | Right against Exploitation | 23–24 |
| 4 | Right to Freedom of Religion | 25–28 |
| 5 | Cultural & Educational Rights | 29–30 |
| 6 | Right to Constitutional Remedies | 32 |

## Key Features

- **Justiciable**: Enforceable by courts
- **Not Absolute**: Reasonable restrictions apply
- Can be **suspended** during Emergency (except Articles 20 & 21)
- **Article 32** — Right to Constitutional Remedies (Dr. Ambedkar called it the "heart and soul" of the Constitution)

## Important Articles

- **Article 14**: Equality before law
- **Article 19**: Six freedoms (speech, assembly, association, movement, residence, profession)
- **Article 21**: Right to life and personal liberty
- **Article 32**: Constitutional remedies (writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto)',
  c.id, 'school', 'published',
  jsonb_build_object('title', 'Fundamental Rights — Complete Lesson', 'description', 'Complete lesson on Fundamental Rights with categories, articles.', 'indexable', true)
from public.concepts c where c.slug = 'fundamental-rights'
on conflict (slug) do nothing;

insert into public.content_assets (type, title, slug, body_md, concept_id, segment, status, seo_json)
select 'lesson', 'Pythagoras Theorem — Complete Lesson', 'lesson-pythagoras-theorem',
'# Pythagoras Theorem

## The Theorem

In a **right-angled triangle**, the square of the hypotenuse equals the sum of squares of the other two sides.

## Formula

```
a² + b² = c²
```

Where:
- `a` and `b` are the two shorter sides (legs)
- `c` is the hypotenuse (longest side, opposite the right angle)

## Example

If a = 3 and b = 4, then:
```
c² = 3² + 4² = 9 + 16 = 25
c = √25 = 5
```

## Pythagorean Triples

| (a, b, c) |
|-----------|
| (3, 4, 5) |
| (5, 12, 13) |
| (8, 15, 17) |
| (7, 24, 25) |

## Converse

If a triangle has sides a, b, c such that **a² + b² = c²**, then the triangle is **right-angled**.

## Applications

- Finding distance between two points
- Checking if a triangle is right-angled
- Construction (ensuring corners are 90°)
- Navigation',
  c.id, 'school', 'published',
  jsonb_build_object('title', 'Pythagoras Theorem — Complete Lesson', 'description', 'Complete lesson on Pythagoras theorem.', 'indexable', true)
from public.concepts c where c.slug = 'pythagoras-theorem'
on conflict (slug) do nothing;

-- ============================================
-- QUESTIONS (20 sample MCQs across concepts)
-- ============================================

-- Photosynthesis questions
insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, status)
select 'mcq', 'Photosynthesis takes place in which organelle?',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', 'Mitochondria'),
    jsonb_build_object('key', 'B', 'text', 'Chloroplast'),
    jsonb_build_object('key', 'C', 'text', 'Nucleus'),
    jsonb_build_object('key', 'D', 'text', 'Ribosome')
  ),
  'B', 'Chloroplasts contain chlorophyll and are the site of photosynthesis.',
  c.id, 'Biology', 1, 'competitive', 'published'
from public.concepts c where c.slug = 'photosynthesis';

insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, status)
select 'mcq', 'The balanced equation of photosynthesis is:',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂'),
    jsonb_build_object('key', 'B', 'text', 'CO₂ + H₂O → C₆H₁₂O₆ + O₂'),
    jsonb_build_object('key', 'C', 'text', '6CO + 6H₂ → C₆H₁₂ + 6H₂O'),
    jsonb_build_object('key', 'D', 'text', 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O')
  ),
  'A', '6 molecules of CO2 and 6 molecules of H2O in presence of light produce glucose and 6 molecules of oxygen.',
  c.id, 'Biology', 2, 'competitive', 'published'
from public.concepts c where c.slug = 'photosynthesis';

insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, status)
select 'mcq', 'The dark reaction of photosynthesis is also known as:',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', 'Hill reaction'),
    jsonb_build_object('key', 'B', 'text', 'Calvin cycle'),
    jsonb_build_object('key', 'C', 'text', 'Krebs cycle'),
    jsonb_build_object('key', 'D', 'text', 'Light reaction')
  ),
  'B', 'The Calvin cycle (dark reaction) fixes CO2 into glucose using ATP and NADPH from light reaction.',
  c.id, 'Biology', 3, 'competitive', 'published'
from public.concepts c where c.slug = 'photosynthesis';

insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, status)
select 'mcq', 'Which pigment is essential for photosynthesis?',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', 'Hemoglobin'),
    jsonb_build_object('key', 'B', 'text', 'Chlorophyll'),
    jsonb_build_object('key', 'C', 'text', 'Melanin'),
    jsonb_build_object('key', 'D', 'text', 'Carotene')
  ),
  'B', 'Chlorophyll is the green pigment in chloroplasts that absorbs light energy for photosynthesis.',
  c.id, 'Biology', 1, 'any', 'published'
from public.concepts c where c.slug = 'photosynthesis';

-- Fundamental Rights questions
insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, source, source_ref, status)
select 'mcq', 'Fundamental Rights are contained in which part of the Indian Constitution?',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', 'Part II'),
    jsonb_build_object('key', 'B', 'text', 'Part III'),
    jsonb_build_object('key', 'C', 'text', 'Part IV'),
    jsonb_build_object('key', 'D', 'text', 'Part V')
  ),
  'B', 'Part III (Articles 12–35) of the Constitution deals with Fundamental Rights.',
  c.id, 'Polity', 1, 'competitive', 'pyq', 'SSC CGL 2022', 'published'
from public.concepts c where c.slug = 'fundamental-rights';

insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, source, source_ref, status)
select 'mcq', 'Which Article is called the "heart and soul" of the Indian Constitution by Dr. Ambedkar?',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', 'Article 14'),
    jsonb_build_object('key', 'B', 'text', 'Article 19'),
    jsonb_build_object('key', 'C', 'text', 'Article 21'),
    jsonb_build_object('key', 'D', 'text', 'Article 32')
  ),
  'D', 'Article 32 (Right to Constitutional Remedies) was called the heart and soul of the Constitution by Dr. B.R. Ambedkar.',
  c.id, 'Polity', 2, 'competitive', 'pyq', 'UPSC Prelims 2021', 'published'
from public.concepts c where c.slug = 'fundamental-rights';

insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, status)
select 'mcq', 'How many categories of Fundamental Rights are guaranteed by the Indian Constitution?',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', '5'),
    jsonb_build_object('key', 'B', 'text', '6'),
    jsonb_build_object('key', 'C', 'text', '7'),
    jsonb_build_object('key', 'D', 'text', '8')
  ),
  'B', 'There are 6 categories: Equality, Freedom, against Exploitation, Freedom of Religion, Cultural & Educational, and Constitutional Remedies.',
  c.id, 'Polity', 1, 'any', 'published'
from public.concepts c where c.slug = 'fundamental-rights';

insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, status)
select 'mcq', 'Right to Life and Personal Liberty is guaranteed under which Article?',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', 'Article 14'),
    jsonb_build_object('key', 'B', 'text', 'Article 19'),
    jsonb_build_object('key', 'C', 'text', 'Article 21'),
    jsonb_build_object('key', 'D', 'text', 'Article 32')
  ),
  'C', 'Article 21 guarantees protection of life and personal liberty — "No person shall be deprived of his life or personal liberty except according to procedure established by law."',
  c.id, 'Polity', 2, 'competitive', 'published'
from public.concepts c where c.slug = 'fundamental-rights';

-- Pythagoras theorem questions
insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, status)
select 'mcq', 'In a right triangle, if the two legs are 3 and 4, what is the length of the hypotenuse?',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', '5'),
    jsonb_build_object('key', 'B', 'text', '6'),
    jsonb_build_object('key', 'C', 'text', '7'),
    jsonb_build_object('key', 'D', 'text', '12')
  ),
  'A', 'Using Pythagoras: c = √(3² + 4²) = √(9+16) = √25 = 5',
  c.id, 'Mathematics', 1, 'any', 'published'
from public.concepts c where c.slug = 'pythagoras-theorem';

insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, status)
select 'mcq', 'Which of the following is NOT a Pythagorean triple?',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', '(3, 4, 5)'),
    jsonb_build_object('key', 'B', 'text', '(5, 12, 13)'),
    jsonb_build_object('key', 'C', 'text', '(7, 24, 25)'),
    jsonb_build_object('key', 'D', 'text', '(2, 3, 4)')
  ),
  'D', '(2,3,4) is not a Pythagorean triple because 2² + 3² = 4+9 = 13 ≠ 4² = 16. All others satisfy a² + b² = c².',
  c.id, 'Mathematics', 2, 'any', 'published'
from public.concepts c where c.slug = 'pythagoras-theorem';

insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, status)
select 'mcq', 'The Pythagoras theorem applies to which type of triangle?',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', 'Equilateral triangle'),
    jsonb_build_object('key', 'B', 'text', 'Isosceles triangle'),
    jsonb_build_object('key', 'C', 'text', 'Right-angled triangle'),
    jsonb_build_object('key', 'D', 'text', 'All triangles')
  ),
  'C', 'The Pythagoras theorem applies specifically to right-angled triangles.',
  c.id, 'Mathematics', 1, 'any', 'published'
from public.concepts c where c.slug = 'pythagoras-theorem';

insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, status)
select 'mcq', 'If a triangle has sides 6, 8, 10, is it a right-angled triangle?',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', 'Yes'),
    jsonb_build_object('key', 'B', 'text', 'No'),
    jsonb_build_object('key', 'C', 'text', 'Cannot be determined'),
    jsonb_build_object('key', 'D', 'text', 'Only if angle is 60°')
  ),
  'A', 'Check: 6² + 8² = 36 + 64 = 100 = 10². Yes, since 6² + 8² = 10², it is right-angled (converse of Pythagoras).',
  c.id, 'Mathematics', 2, 'any', 'published'
from public.concepts c where c.slug = 'pythagoras-theorem';

-- Newton's laws questions
insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, status)
select 'mcq', 'Newton''s second law of motion is represented by which formula?',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', 'F = ma'),
    jsonb_build_object('key', 'B', 'text', 'E = mc²'),
    jsonb_build_object('key', 'C', 'text', 'F = mv'),
    jsonb_build_object('key', 'D', 'text', 'P = mv')
  ),
  'A', 'Newton''s Second Law: Force = mass × acceleration (F = ma).',
  c.id, 'Physics', 1, 'competitive', 'published'
from public.concepts c where c.slug = 'newtons-laws-of-motion';

insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, status)
select 'mcq', 'The tendency of an object to resist change in its state of motion is called:',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', 'Momentum'),
    jsonb_build_object('key', 'B', 'text', 'Inertia'),
    jsonb_build_object('key', 'C', 'text', 'Friction'),
    jsonb_build_object('key', 'D', 'text', 'Force')
  ),
  'B', 'Inertia is the property of an object to resist any change in its state of rest or motion (Newton''s First Law).',
  c.id, 'Physics', 1, 'any', 'published'
from public.concepts c where c.slug = 'newtons-laws-of-motion';

insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, status)
select 'mcq', 'When you push a wall, the wall pushes back on you with an equal force. This is an example of:',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', 'Newton''s First Law'),
    jsonb_build_object('key', 'B', 'text', 'Newton''s Second Law'),
    jsonb_build_object('key', 'C', 'text', 'Newton''s Third Law'),
    jsonb_build_object('key', 'D', 'text', 'Law of Conservation of Energy')
  ),
  'C', 'Newton''s Third Law: For every action, there is an equal and opposite reaction.',
  c.id, 'Physics', 2, 'any', 'published'
from public.concepts c where c.slug = 'newtons-laws-of-motion';

insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, status)
select 'mcq', 'If a force of 10 N is applied on a body of mass 2 kg, what is the acceleration produced?',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', '2 m/s²'),
    jsonb_build_object('key', 'B', 'text', '5 m/s²'),
    jsonb_build_object('key', 'C', 'text', '10 m/s²'),
    jsonb_build_object('key', 'D', 'text', '20 m/s²')
  ),
  'B', 'From F = ma: a = F/m = 10/2 = 5 m/s²',
  c.id, 'Physics', 2, 'competitive', 'published'
from public.concepts c where c.slug = 'newtons-laws-of-motion';

-- Indian Parliament questions
insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, source, source_ref, status)
select 'mcq', 'The Parliament of India consists of:',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', 'Lok Sabha + Rajya Sabha'),
    jsonb_build_object('key', 'B', 'text', 'President + Lok Sabha + Rajya Sabha'),
    jsonb_build_object('key', 'C', 'text', 'Prime Minister + Cabinet'),
    jsonb_build_object('key', 'D', 'text', 'Supreme Court + Parliament')
  ),
  'B', 'As per Article 79, Parliament = President + Lok Sabha + Rajya Sabha.',
  c.id, 'Polity', 1, 'competitive', 'pyq', 'SSC GD 2023', 'published'
from public.concepts c where c.slug = 'indian-parliament';

insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, status)
select 'mcq', 'What is the maximum gap between two sessions of Parliament?',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', '3 months'),
    jsonb_build_object('key', 'B', 'text', '4 months'),
    jsonb_build_object('key', 'C', 'text', '6 months'),
    jsonb_build_object('key', 'D', 'text', '1 year')
  ),
  'C', 'The maximum gap between two sessions of Parliament cannot exceed 6 months (Article 85).',
  c.id, 'Polity', 2, 'competitive', 'published'
from public.concepts c where c.slug = 'indian-parliament';

insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, status)
select 'mcq', 'The Rajya Sabha is a:',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', 'Temporary house, dissolved every 5 years'),
    jsonb_build_object('key', 'B', 'text', 'Permanent house, never dissolved'),
    jsonb_build_object('key', 'C', 'text', 'Dissolved every 6 years'),
    jsonb_build_object('key', 'D', 'text', 'Dissolved every 2 years')
  ),
  'B', 'Rajya Sabha is a permanent body — it is never dissolved. 1/3 of its members retire every 2 years.',
  c.id, 'Polity', 2, 'competitive', 'published'
from public.concepts c where c.slug = 'indian-parliament';

insert into public.questions (type, body, options_json, correct_answer, explanation, concept_id, subject, difficulty, exam_format, status)
select 'mcq', 'How many members are there in the Lok Sabha (as per current strength)?',
  jsonb_build_array(
    jsonb_build_object('key', 'A', 'text', '245'),
    jsonb_build_object('key', 'B', 'text', '543'),
    jsonb_build_object('key', 'C', 'text', '550'),
    jsonb_build_object('key', 'D', 'text', '500')
  ),
  'B', 'The Lok Sabha currently has 543 members (the 2 Anglo-Indian seats were abolished in 2020).',
  c.id, 'Polity', 2, 'competitive', 'published'
from public.concepts c where c.slug = 'indian-parliament';

-- GK-tagged questions
update public.questions
set gk_relevance = 'high'
where subject in ('Polity', 'Biology') and status = 'published'
and concept_id in (select id from public.concepts where slug in ('fundamental-rights', 'indian-parliament'));
