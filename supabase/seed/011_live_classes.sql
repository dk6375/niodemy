-- ============================================
-- Seed Data: Live Classes (sample)
-- ============================================

insert into public.live_classes (slug, title, description, teacher_name, youtube_video_id, youtube_url, scheduled_at, duration_minutes, status, segment, subject, is_featured)
values
(
  'photosynthesis-deep-dive-neet',
  'Photosynthesis Deep Dive — NEET Preparation',
  'Comprehensive session on photosynthesis for NEET aspirants. Light reactions, Calvin cycle, C3/C4 pathways, and previous year questions.',
  'Dr. Ananya Sharma',
  'dQw4w9WgXcQ',  -- sample YouTube ID
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '2025-12-15 17:00:00+00:00',
  90,
  'scheduled',
  'senior',
  'Biology',
  true
) on conflict (slug) do nothing;

insert into public.live_classes (slug, title, description, teacher_name, youtube_video_id, youtube_url, scheduled_at, duration_minutes, status, segment, subject, is_featured)
values
(
  'rrb-group-d-math-crash-course',
  'RRB Group D Math Crash Course',
  'Quick revision of all important math topics for RRB Group D exam. Time-saving tricks and shortcut methods.',
  'Rajesh Kumar',
  'dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '2025-12-20 18:00:00+00:00',
  60,
  'scheduled',
  'coaching',
  'Mathematics',
  false
) on conflict (slug) do nothing;

insert into public.live_classes (slug, title, description, teacher_name, youtube_video_id, youtube_url, scheduled_at, duration_minutes, status, segment, subject, is_featured)
values
(
  'class-10-light-reflection-mastery',
  'Class 10 Light: Reflection & Refraction Mastery',
  'Complete chapter revision for Class 10 Science. Mirror formula, lens formula, ray diagrams, and exam tips.',
  'Priya Singh',
  'dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '2025-12-18 16:00:00+00:00',
  75,
  'scheduled',
  'school',
  'Physics',
  true
) on conflict (slug) do nothing;

insert into public.live_classes (slug, title, description, teacher_name, youtube_video_id, youtube_url, scheduled_at, duration_minutes, status, segment, subject, is_featured)
values
(
  'python-basics-live-workshop',
  'Python Basics Live Workshop',
  'Hands-on Python workshop for beginners. Write your first Python program, learn variables, and run code live.',
  'Amit Patel',
  'dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '2025-12-22 19:00:00+00:00',
  120,
  'scheduled',
  'skills',
  'Programming',
  false
) on conflict (slug) do nothing;
