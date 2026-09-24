-- ============================================
-- Seed Data: ITI Trades + Modules
-- ============================================
-- For Session 12: ITI segment demo

-- ============================================
-- TRADES
-- ============================================

insert into public.iti_trades (slug, name, code, duration_years, nco_code, description, career_opportunities, seo_json, status)
values
(
  'electrician',
  'Electrician',
  'ELE',
  2,
  'NCO 722',
  'ITI Electrician trade covers installation, maintenance, and repair of electrical systems, wiring, motors, transformers, and appliances. Students learn electrical safety, circuits, and practical wiring.',
  'Electrician in factories, Maintenance technician, Wireman, Electrical contractor, PSU apprentice (BHEL, NTPC, Railways)',
  jsonb_build_object(
    'title', 'ITI Electrician — Modules, Notes, Practical Guides',
    'description', 'Free ITI Electrician trade study material. Semester-wise modules, practical guides, safety protocols.',
    'indexable', true
  ),
  'active'
) on conflict (slug) do nothing;

insert into public.iti_trades (slug, name, code, duration_years, nco_code, description, career_opportunities, seo_json, status)
values
(
  'fitter',
  'Fitter',
  'FIT',
  2,
  'NCO 723',
  'ITI Fitter trade covers mechanical assembly, fitting, maintenance of machines, marking, cutting, drilling, and precision measurement.',
  'Fitter in factories, Maintenance technician, Machine operator, Assembly line supervisor',
  jsonb_build_object(
    'title', 'ITI Fitter — Modules, Notes, Practical Guides',
    'description', 'Free ITI Fitter trade study material. Semester-wise modules, practical guides, workshop techniques.',
    'indexable', true
  ),
  'active'
) on conflict (slug) do nothing;

insert into public.iti_trades (slug, name, code, duration_years, nco_code, description, career_opportunities, seo_json, status)
values
(
  'copa',
  'COPA (Computer Operator & Programming Assistant)',
  'COPA',
  1,
  'NCO 414',
  'ITI COPA trade covers computer fundamentals, operating systems, MS Office, internet, basic programming, and data entry operations.',
  'Computer operator, Data entry operator, Office assistant, Junior programmer',
  jsonb_build_object(
    'title', 'ITI COPA — Modules, Notes, Practical Exercises',
    'description', 'Free ITI COPA trade study material. Computer fundamentals, MS Office, programming basics.',
    'indexable', true
  ),
  'active'
) on conflict (slug) do nothing;

-- ============================================
-- ITI MODULES for Electrician (Semester 1-2 sample)
-- ============================================

insert into public.iti_modules (trade_id, semester_number, module_number, title, slug, description, module_type, duration_hours)
select t.id, 1, 1, 'Electrical Safety & First Aid', 'electrical-safety-first-aid',
  'Safety practices: electrical hazards, PPE, first aid for electric shock, CPR, lockout/tagout procedures.',
  'safety', 40
from public.iti_trades t where t.slug = 'electrician'
on conflict do nothing;

insert into public.iti_modules (trade_id, semester_number, module_number, title, slug, description, module_type, duration_hours)
select t.id, 1, 2, 'Hand Tools & Measuring Instruments', 'hand-tools-measuring-instruments',
  'Identification and use of hand tools (pliers, screwdrivers, wire strippers), measuring instruments (multimeter, voltmeter, ammeter, megger).',
  'theory', 60
from public.iti_trades t where t.slug = 'electrician'
on conflict do nothing;

insert into public.iti_modules (trade_id, semester_number, module_number, title, slug, description, module_type, duration_hours)
select t.id, 1, 3, 'Basic Electrical Concepts', 'basic-electrical-concepts',
  'Ohm''s law, Kirchhoff''s laws, resistance, capacitance, inductance, AC/DC circuits, series and parallel circuits.',
  'theory', 80
from public.iti_trades t where t.slug = 'electrician'
on conflict do nothing;

insert into public.iti_modules (trade_id, semester_number, module_number, title, slug, description, module_type, duration_hours)
select t.id, 1, 4, 'Wiring Practice Workshop', 'wiring-practice-workshop',
  'Practical wiring: conduit wiring, casing-capping, batten wiring, earthing practice, switchboard assembly.',
  'workshop', 120
from public.iti_trades t where t.slug = 'electrician'
on conflict do nothing;

insert into public.iti_modules (trade_id, semester_number, module_number, title, slug, description, module_type, duration_hours)
select t.id, 2, 1, 'DC Machines', 'dc-machines',
  'DC generators and motors: construction, working principle, types, characteristics, starting and speed control.',
  'theory', 100
from public.iti_trades t where t.slug = 'electrician'
on conflict do nothing;

insert into public.iti_modules (trade_id, semester_number, module_number, title, slug, description, module_type, duration_hours)
select t.id, 2, 2, 'Transformers', 'transformers',
  'Single-phase and three-phase transformers: construction, working, efficiency, losses, testing, maintenance.',
  'theory', 80
from public.iti_trades t where t.slug = 'electrician'
on conflict do nothing;

insert into public.iti_modules (trade_id, semester_number, module_number, title, slug, description, module_type, duration_hours)
select t.id, 2, 3, 'AC Machines Lab', 'ac-machines-lab',
  'Practical: AC motor winding, alternator testing, induction motor maintenance, transformer testing.',
  'practical', 140
from public.iti_trades t where t.slug = 'electrician'
on conflict do nothing;

-- ============================================
-- ITI MODULES for Fitter (Semester 1 sample)
-- ============================================

insert into public.iti_modules (trade_id, semester_number, module_number, title, slug, description, module_type, duration_hours)
select t.id, 1, 1, 'Workshop Safety', 'workshop-safety',
  'Workshop safety rules, PPE, fire safety, first aid, safe use of hand and power tools.',
  'safety', 30
from public.iti_trades t where t.slug = 'fitter'
on conflict do nothing;

insert into public.iti_modules (trade_id, semester_number, module_number, title, slug, description, module_type, duration_hours)
select t.id, 1, 2, 'Bench Working Tools', 'bench-working-tools',
  'Files, hacksaw, chisels, hammers, taps, dies — identification, use, and maintenance.',
  'theory', 50
from public.iti_trades t where t.slug = 'fitter'
on conflict do nothing;

insert into public.iti_modules (trade_id, semester_number, module_number, title, slug, description, module_type, duration_hours)
select t.id, 1, 3, 'Marking & Measurement', 'marking-measurement',
  'Marking tools (scriber, punch, surface plate), measuring instruments (vernier caliper, micrometer, dial gauge).',
  'theory', 60
from public.iti_trades t where t.slug = 'fitter'
on conflict do nothing;

insert into public.iti_modules (trade_id, semester_number, module_number, title, slug, description, module_type, duration_hours)
select t.id, 1, 4, 'Fitting Practice Workshop', 'fitting-practice-workshop',
  'Practical: filing, sawing, chipping, drilling, tapping, dieing, and assembly practice.',
  'workshop', 150
from public.iti_trades t where t.slug = 'fitter'
on conflict do nothing;

-- ============================================
-- ITI MODULES for COPA (Semester 1 sample)
-- ============================================

insert into public.iti_modules (trade_id, semester_number, module_number, title, slug, description, module_type, duration_hours)
select t.id, 1, 1, 'Computer Fundamentals', 'computer-fundamentals',
  'Computer hardware components, input/output devices, storage, operating system basics.',
  'theory', 40
from public.iti_trades t where t.slug = 'copa'
on conflict do nothing;

insert into public.iti_modules (trade_id, semester_number, module_number, title, slug, description, module_type, duration_hours)
select t.id, 1, 2, 'Operating System (Windows)', 'operating-system-windows',
  'Windows OS: file management, control panel, settings, basic troubleshooting.',
  'theory', 30
from public.iti_trades t where t.slug = 'copa'
on conflict do nothing;

insert into public.iti_modules (trade_id, semester_number, module_number, title, slug, description, module_type, duration_hours)
select t.id, 1, 3, 'MS Office Suite', 'ms-office-suite',
  'MS Word (document creation), MS Excel (formulas, charts), MS PowerPoint (presentations).',
  'practical', 80
from public.iti_trades t where t.slug = 'copa'
on conflict do nothing;

insert into public.iti_modules (trade_id, semester_number, module_number, title, slug, description, module_type, duration_hours)
select t.id, 1, 4, 'Internet & Data Entry', 'internet-data-entry',
  'Internet browsing, email, search engines, data entry operations, typing practice.',
  'practical', 50
from public.iti_trades t where t.slug = 'copa'
on conflict do nothing;
