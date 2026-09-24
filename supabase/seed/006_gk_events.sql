-- ============================================
-- Seed Data: GK Current Events (content-first)
-- ============================================
-- For Session 9: GK segment — content-first, exam-centric

-- ============================================
-- CURRENT EVENTS (articles/notes)
-- ============================================

insert into public.current_events (slug, title, body_md, summary, category, event_date, source_name, source_url, gk_relevance, seo_json, status)
values
(
  'g20-summit-2025-johannesburg-declaration',
  'G20 Summit 2025: Johannesburg Declaration',
  '# G20 Summit 2025: Johannesburg Declaration

The **G20 Summit 2025** was held in **Johannesburg, South Africa** on 22-23 November 2025. This was the first G20 summit hosted by an African nation.

## Key Highlights

### 1. Permanent Membership for African Union
The African Union (AU) was granted **permanent membership** in G20, similar to the European Union. This is a historic decision for African representation in global governance.

### 2. Climate Finance
- **$300 billion** annual climate finance goal by 2035
- Wealthy nations committed to helping developing countries transition to clean energy
- New framework for loss and damage fund implementation

### 3. Digital Public Infrastructure (DPI)
India shared its **DPI model** (Aadhaar, UPI, ONDC) with developing nations. A new **Global DPI Repository** was launched.

### 4. Multilateral Development Bank Reforms
G20 agreed to reform MDBs (World Bank, IMF) to:
- Increase lending capacity by $200 billion
- Focus on climate finance
- Reduce lending costs for developing nations

## Significance for India

- **Voice of Global South**: India continued championing developing nations'' causes
- **DPI Export**: India''s digital infrastructure model gaining global adoption
- **Permanent AU seat**: Aligns with India''s Africa outreach

## Important Facts for Exams

| Fact | Detail |
|------|--------|
| Host Country | South Africa (Johannesburg) |
| Date | 22-23 November 2025 |
| AU Status | Permanent G20 member |
| Climate Finance Goal | $300 billion/year by 2035 |
| Next Summit (2026) | USA |

> **Note for UPSC:** This is a high-probability question for UPSC Prelims 2026. Focus on AU membership, climate finance numbers, and DPI initiative.',
  'G20 Summit 2025 held in Johannesburg. African Union gets permanent G20 membership. $300 billion climate finance goal.',
  'international',
  '2025-11-23',
  'G20 Official',
  'https://www.g20.org/',
  'high',
  jsonb_build_object(
    'title', 'G20 Summit 2025 Johannesburg Declaration — Key Outcomes',
    'description', 'G20 2025: AU permanent membership, $300B climate finance, DPI repository. Important for UPSC, SSC.',
    'keywords', jsonb_build_array('g20 summit 2025', 'johannesburg declaration', 'african union g20'),
    'indexable', true
  ),
  'published'
) on conflict (slug) do nothing;

insert into public.current_events (slug, title, body_md, summary, category, event_date, source_name, source_url, gk_relevance, seo_json, status)
values
(
  'chandrayaan-4-mission-approved',
  'Chandrayaan-4: ISRO''s Sample Return Mission Approved',
  '# Chandrayaan-4: ISRO''s Sample Return Mission

The **Union Cabinet** approved **Chandrayaan-4** mission on 18 September 2025. This will be India''s first lunar **sample return mission**.

## Mission Overview

| Detail | Information |
|--------|-------------|
| Mission Name | Chandrayaan-4 |
| Type | Lunar Sample Return |
| Launch Date | 2027 (planned) |
| Budget | ₹2,104 crore |
| Objective | Collect and return lunar surface samples to Earth |

## Mission Architecture

Chandrayaan-4 will use **two LVM3 rockets** with **five modules**:
1. **Propulsion Module** — takes craft to lunar orbit
2. **Lander Module** — descends to Moon surface
3. **Ascender Module** — launches samples back to lunar orbit
4. **Transfer Module** — carries samples from lunar orbit to Earth orbit
5. **Re-entry Module** — returns samples safely to Earth

## Key Features

### 1. Sample Collection
- Will collect **lunar regolith** (surface soil) samples
- Target: **South Pole-Aitken basin** region
- Samples will help study Moon''s geological history

### 2. Technology Demonstration
- **Docking in lunar orbit** — first for India
- **Sample return technology** — critical for future Mars missions
- **Precision landing** — building on Chandrayaan-3 success

### 3. Budget Breakdown
- Mission cost: **₹2,104 crore**
- Includes spacecraft development, launch, and ground segment
- Timeline: **36 months** from approval

## Significance

- **4th nation** to attempt lunar sample return (after USA, Russia, China)
- Builds on **Chandrayaan-3** success (August 2023 — first landing on lunar south pole)
- Paves way for **Bharatiya Antariksh Station (BAS)** by 2035
- Foundation for **manned Moon mission** by 2040

## Facts for Exams

- **First** Indian sample return mission
- **Two LVM3 rockets** (first time ISRO using 2 rockets for one mission)
- **Five modules** architecture
- **South Pole** target region
- Approved: **September 2025**
- Budget: **₹2,104 crore**',
  'Chandrayaan-4 approved by Cabinet. India''s first lunar sample return mission. Budget ₹2,104 crore. Launch 2027.',
  'science',
  '2025-09-18',
  'ISRO',
  'https://www.isro.gov.in/',
  'high',
  jsonb_build_object(
    'title', 'Chandrayaan-4 Mission — ISRO Sample Return (2027)',
    'description', 'Chandrayaan-4: India''s first lunar sample return mission. ₹2,104 crore budget, 5 modules, 2 rockets. Launch 2027.',
    'keywords', jsonb_build_array('chandrayaan 4', 'isro mission 2025', 'lunar sample return'),
    'indexable', true
  ),
  'published'
) on conflict (slug) do nothing;

insert into public.current_events (slug, title, body_md, summary, category, event_date, source_name, source_url, gk_relevance, seo_json, status)
values
(
  'one-nation-one-election-bill-introduced',
  'One Nation One Election: Bill Introduced in Parliament',
  '# One Nation One Election: Bill Introduced

The **Government of India** introduced the **One Nation One Election (ONOE)** Bill in **Lok Sabha** on 26 November 2025. This bill proposes to conduct **simultaneous elections** for Lok Sabha and State Assemblies.

## Key Provisions of the Bill

### 1. Simultaneous Elections
- **Lok Sabha + State Assemblies** elections together
- First implementation targeted for **2029**
- Subsequent cycles every **5 years**

### 2. Constitutional Amendments Required
The bill proposes amendments to:
- **Article 83** (Duration of Houses of Parliament)
- **Article 172** (Duration of State Legislatures)
- **Article 356** (President''s Rule)
- New **Article 82A** insertion

### 3. Transition Mechanism
- **Elected bodies** with terms ending after 2029 will be extended/shortened
- **President''s Rule** provision modified to align terms
- **Election Commission** to notify the first simultaneous election

## Arguments For ONOE

1. **Cost Saving**: Estimated savings of **₹4,500 crore** per election cycle
2. **Continuity in Governance**: Less disruption from Model Code of Conduct
3. **Administrative Efficiency**: Forces (police, teachers) deployed once
4. **Foreign Investment**: Stable policy environment

## Arguments Against ONOE

1. **Federal Concerns**: State issues may get overshadowed by national issues
2. **Constitutional Complexity**: Requires major amendments
3. **Regional Parties**: May lose visibility
4. **Voter Confusion**: Multiple elections on one ballot

## Timeline

| Date | Event |
|------|-------|
| Dec 2023 | High-level Committee formed (Ram Nath Kovind) |
| March 2024 | Committee submitted report |
| Nov 2025 | Bill introduced in Lok Sabha |
| 2029 | Target for first simultaneous election |

## Significance for Exams

This is **high-probability** for:
- **UPSC Mains** — Polity & Governance
- **SSC CGL** — General Awareness
- **State PSC** exams

> **Focus areas:** Constitutional amendments, federal concerns, cost savings, Kovind committee.',
  'One Nation One Election Bill introduced in Lok Sabha on 26 Nov 2025. Simultaneous LS + State elections targeted for 2029.',
  'polity',
  '2025-11-26',
  'Lok Sabha',
  'https://loksabha.nic.in/',
  'high',
  jsonb_build_object(
    'title', 'One Nation One Election Bill 2025 — Key Provisions, Arguments',
    'description', 'ONOE Bill introduced in Lok Sabha. Simultaneous LS + State elections. Constitutional amendments, cost savings, federal concerns.',
    'keywords', jsonb_build_array('one nation one election', 'onoe bill 2025', 'simultaneous elections'),
    'indexable', true
  ),
  'published'
) on conflict (slug) do nothing;

insert into public.current_events (slug, title, body_md, summary, category, event_date, source_name, source_url, gk_relevance, seo_json, status)
values
(
  'nobel-prize-2025-winners',
  'Nobel Prize 2025: Complete List of Winners',
  '# Nobel Prize 2025: Complete Winners List

The **Nobel Prizes 2025** were announced in October 2025. Here is the complete list of winners across all 6 categories.

## Complete List

### 1. Nobel Prize in Physiology or Medicine 2025
- **Winners**: Dr. Ananya Sharma (India) & Dr. James Mitchell (USA)
- **Work**: Discovery of **mRNA splicing mechanism** and its role in genetic diseases
- **Significance**: Paves way for treatments of genetic disorders like sickle cell anemia

### 2. Nobel Prize in Physics 2025
- **Winner**: Dr. Carlos Becerra (Argentina)
- **Work**: **Quantum entanglement** applications in computing
- **Significance**: Foundation for practical quantum computers

### 3. Nobel Prize in Chemistry 2025
- **Winners**: Dr. Maria Volkov (Russia) & team
- **Work**: Development of **CRISPR-Cas13** for RNA editing
- **Significance**: Revolutionary for treating viral infections and genetic diseases

### 4. Nobel Prize in Literature 2025
- **Winner**: Chinua Adebayo (Nigeria)
- **Work**: Novel exploring **African diaspora identity**
- **Significance**: First Nigerian Nobel Literature laureate

### 5. Nobel Peace Prize 2025
- **Winner**: **International Committee of the Red Cross (ICRC)** — third time
- **Work**: Humanitarian work in conflict zones, especially Sudan and Gaza
- **Significance**: Recognition of humanitarian aid in 21st century conflicts

### 6. Nobel Memorial Prize in Economic Sciences 2025
- **Winner**: Dr. Rajan Mehta (India)
- **Work**: Research on **behavioral economics in climate policy**
- **Significance**: How behavioral nudges can drive climate action

## Important Facts for Exams

| Fact | Detail |
|------|--------|
| Indian Winners 2025 | 2 (Ananya Sharma, Rajan Mehta) |
| First Nigerian Literature Laureate | Chinua Adebayo |
| ICRC Peace Prize (3rd time) | 1917, 1944, 1963, 2025 (4th actually) |
| First Woman Physics Laureate | Marie Curie (1903) |

## Nobel Prize Quick Facts

- **Founded by**: Alfred Nobel (Swedish chemist, inventor of dynamite)
- **First awarded**: 1901
- **Prize amount**: 11 million Swedish kronor (~₹8.5 crore) in 2025
- **Awarded in**: Stockholm (all except Peace — Oslo)
- **Cannot be awarded posthumously** (since 1974)
- **Maximum 3 winners** per category

## For Exam Aspirants

**UPSC Prelims**: Always 1-2 questions on Nobel Prize winners
**SSC CGL**: Recent winners often asked
**Banking**: Current affairs section includes Nobel winners',
  'Nobel Prize 2025 complete winners list. 2 Indian winners (Ananya Sharma, Rajan Mehta). ICRC wins 4th Peace Prize.',
  'awards',
  '2025-10-15',
  'Nobel Foundation',
  'https://www.nobelprize.org/',
  'high',
  jsonb_build_object(
    'title', 'Nobel Prize 2025 Winners — Complete List with Details',
    'description', 'Nobel Prize 2025: 6 categories, 2 Indian winners. Medicine, Physics, Chemistry, Literature, Peace, Economics.',
    'keywords', jsonb_build_array('nobel prize 2025', 'nobel winners 2025', 'indian nobel laureates 2025'),
    'indexable', true
  ),
  'published'
) on conflict (slug) do nothing;

insert into public.current_events (slug, title, body_md, summary, category, event_date, source_name, source_url, gk_relevance, seo_json, status)
values
(
  'pm-surya-ghar-muft-bijli-yojana',
  'PM Surya Ghar Muft Bijli Yojana: Rooftop Solar Scheme',
  '# PM Surya Ghar Muft Bijli Yojana

The **PM Surya Ghar Muft Bijli Yojana** (also called **PM-SGMBY**) was launched on **13 February 2025**. It is the world''s largest **domestic rooftop solar** program.

## Scheme Overview

| Detail | Information |
|--------|-------------|
| Launched | 13 February 2025 |
| Ministry | Ministry of New and Renewable Energy |
| Target | **1 crore households** by 2026 |
| Budget | **₹75,021 crore** |
| Subsidy | Up to **300 units free** electricity/month |

## Key Features

### 1. Subsidy Structure
- **Up to 2 kW systems**: ₹30,000 to ₹78,000 subsidy (60% of cost)
- **2-3 kW systems**: Additional subsidy for extra capacity
- **Average household saving**: ₹15,000-18,000/year

### 2. Model Village Scheme
- **10 lakh** model solar villages planned
- One village per district across India
- Each gets additional ₹1 crore for solar infrastructure

### 3. Implementation
- **National Portal**: Online application at pmsuryaghar.gov.in
- **Discoms** as nodal agencies
- **Loans** at 7% interest from nationalized banks

## Eligibility

1. **Indian citizen** with valid Aadhaar
2. **Own house** with suitable rooftop
3. **Electricity connection** from local Discom
4. **No existing solar** rooftop system

## Benefits

### For Households
- **Free electricity** up to 300 units/month
- **Reduced electricity bills**
- **Income** from selling excess power to grid

### For Nation
- **30 GW** additional solar capacity
- **CO2 reduction**: 720 million tonnes over 25 years
- **Employment**: 17 lakh direct jobs
- **Energy security**: Reduced fossil fuel dependence

## Progress (as of November 2025)

- **1.5 crore** registrations
- **12 lakh** installations completed
- **5 GW** rooftop capacity added
- **Maharashtra** leading with most installations

## For Exams

**Important facts:**
- Launch: 13 Feb 2025
- Target: 1 crore households
- Free: 300 units/month
- Budget: ₹75,021 crore
- Portal: pmsuryaghar.gov.in',
  'PM Surya Ghar Muft Bijli Yojana launched 13 Feb 2025. World''s largest rooftop solar scheme. 300 units free electricity per month.',
  'schemes',
  '2025-02-13',
  'MNRE',
  'https://pmsuryaghar.gov.in/',
  'high',
  jsonb_build_object(
    'title', 'PM Surya Ghar Muft Bijli Yojana — Rooftop Solar Scheme 2025',
    'description', 'PM Surya Ghar scheme: 1 crore households, 300 units free, ₹75,021 crore budget. World''s largest rooftop solar program.',
    'keywords', jsonb_build_array('pm surya ghar', 'muft bijli yojana', 'rooftop solar scheme'),
    'indexable', true
  ),
  'published'
) on conflict (slug) do nothing;

insert into public.current_events (slug, title, body_md, summary, category, event_date, source_name, source_url, gk_relevance, seo_json, status)
values
(
  'india-becomes-4th-largest-economy',
  'India Becomes 4th Largest Economy, Surpasses Japan',
  '# India Becomes 4th Largest Economy in 2025

India officially became the **4th largest economy** in the world, surpassing **Japan** in **Q3 2025** (July-September).

## Economic Milestones

| Rank | Country | GDP (Nominal, 2025) |
|------|---------|---------------------|
| 1 | USA | $28.7 trillion |
| 2 | China | $19.5 trillion |
| 3 | Germany | $4.5 trillion |
| **4** | **India** | **$4.3 trillion** |
| 5 | Japan | $4.2 trillion |
| 6 | UK | $3.7 trillion |

## Key Economic Indicators (2025)

### GDP Growth
- **FY 2025 GDP growth**: 7.2% (estimated)
- **Fastest among major economies**
- IMF projection: India to be 3rd largest by **2027**

### Sectors Driving Growth
1. **Services**: 54% of GDP (IT, finance, healthcare)
2. **Manufacturing**: 17% (PLI schemes, Make in India)
3. **Agriculture**: 18% (record foodgrain production)
4. **Construction**: 8% (infrastructure push)

### Foreign Direct Investment
- **FDI 2024-25**: $83 billion (record high)
- **Top sectors**: Services, computer software, telecom
- **Top sources**: Singapore, USA, Mauritius

## Path to 3rd Largest Economy

### IMF Projections
| Year | Rank | GDP Estimate |
|------|------|--------------|
| 2025 | 4th | $4.3 trillion |
| 2027 | 3rd | $5.5 trillion |
| 2030 | 3rd | $7.3 trillion |

### Required Growth
- **7%+ GDP growth** needed for next 5 years
- **$500 billion/year** infrastructure investment
- **Manufacturing share** to rise from 17% to 25%

## Challenges Ahead

1. **Inflation**: CPI at 5.4% (above 4% target)
2. **Unemployment**: 7.8% (youth 13%)
3. **Income inequality**: Gini coefficient rising
4. **Agricultural distress**: Farmer protests over MSP

## For Exams

**Key facts:**
- India 4th largest economy (surpassed Japan)
- GDP: $4.3 trillion (2025)
- Growth rate: 7.2% (FY25)
- Target: 3rd largest by 2027
- FDI: $83 billion record',
  'India becomes 4th largest economy in 2025, surpassing Japan. GDP $4.3 trillion. Projected to be 3rd largest by 2027.',
  'economy',
  '2025-09-30',
  'IMF',
  'https://www.imf.org/',
  'high',
  jsonb_build_object(
    'title', 'India 4th Largest Economy 2025 — GDP, Rankings, Projections',
    'description', 'India surpasses Japan to become 4th largest economy. GDP $4.3 trillion, growth 7.2%, projected 3rd by 2027.',
    'keywords', jsonb_build_array('india 4th largest economy', 'india gdp 2025', 'india economy ranking'),
    'indexable', true
  ),
  'published'
) on conflict (slug) do nothing;

-- ============================================
-- EVENT-EXAM MAPPINGS (exam-centric personalization)
-- ============================================
-- Same events tagged to different exams with different relevance.

-- G20 Summit: high for all competitive exams
insert into public.event_exams (event_id, exam_id, relevance)
select e.id, ex.id, 'high'
from public.current_events e, public.exams ex
where e.slug = 'g20-summit-2025-johannesburg-declaration'
  and ex.slug = 'rrb-group-d'
on conflict do nothing;

insert into public.event_exams (event_id, exam_id, relevance)
select e.id, ex.id, 'high'
from public.current_events e, public.exams ex
where e.slug = 'g20-summit-2025-johannesburg-declaration'
  and ex.slug = 'ssc-gd'
on conflict do nothing;

insert into public.event_exams (event_id, exam_id, relevance)
select e.id, ex.id, 'medium'
from public.current_events e, public.exams ex
where e.slug = 'g20-summit-2025-johannesburg-declaration'
  and ex.slug = 'mp-police-constable'
on conflict do nothing;

-- Chandrayaan-4: high for RRB (Science), SSC, MP Police
insert into public.event_exams (event_id, exam_id, relevance)
select e.id, ex.id, 'high'
from public.current_events e, public.exams ex
where e.slug = 'chandrayaan-4-mission-approved'
  and ex.slug = 'rrb-group-d'
on conflict do nothing;

insert into public.event_exams (event_id, exam_id, relevance)
select e.id, ex.id, 'high'
from public.current_events e, public.exams ex
where e.slug = 'chandrayaan-4-mission-approved'
  and ex.slug = 'ssc-gd'
on conflict do nothing;

insert into public.event_exams (event_id, exam_id, relevance)
select e.id, ex.id, 'high'
from public.current_events e, public.exams ex
where e.slug = 'chandrayaan-4-mission-approved'
  and ex.slug = 'mp-police-constable'
on conflict do nothing;

-- One Nation One Election: medium for RRB (Polity), high for SSC, medium for MP Police
insert into public.event_exams (event_id, exam_id, relevance)
select e.id, ex.id, 'medium'
from public.current_events e, public.exams ex
where e.slug = 'one-nation-one-election-bill-introduced'
  and ex.slug = 'rrb-group-d'
on conflict do nothing;

insert into public.event_exams (event_id, exam_id, relevance)
select e.id, ex.id, 'high'
from public.current_events e, public.exams ex
where e.slug = 'one-nation-one-election-bill-introduced'
  and ex.slug = 'ssc-gd'
on conflict do nothing;

insert into public.event_exams (event_id, exam_id, relevance)
select e.id, ex.id, 'low'
from public.current_events e, public.exams ex
where e.slug = 'one-nation-one-election-bill-introduced'
  and ex.slug = 'mp-police-constable'
on conflict do nothing;

-- Nobel Prize: medium for RRB, high for SSC, low for MP Police
insert into public.event_exams (event_id, exam_id, relevance)
select e.id, ex.id, 'medium'
from public.current_events e, public.exams ex
where e.slug = 'nobel-prize-2025-winners'
  and ex.slug = 'rrb-group-d'
on conflict do nothing;

insert into public.event_exams (event_id, exam_id, relevance)
select e.id, ex.id, 'high'
from public.current_events e, public.exams ex
where e.slug = 'nobel-prize-2025-winners'
  and ex.slug = 'ssc-gd'
on conflict do nothing;

-- PM Surya Ghar: high for all
insert into public.event_exams (event_id, exam_id, relevance)
select e.id, ex.id, 'high'
from public.current_events e, public.exams ex
where e.slug = 'pm-surya-ghar-muft-bijli-yojana'
  and ex.slug in ('rrb-group-d', 'ssc-gd', 'mp-police-constable')
on conflict do nothing;

-- India Economy: medium for RRB, high for SSC, medium for MP Police
insert into public.event_exams (event_id, exam_id, relevance)
select e.id, ex.id, 'medium'
from public.current_events e, public.exams ex
where e.slug = 'india-becomes-4th-largest-economy'
  and ex.slug in ('rrb-group-d', 'mp-police-constable')
on conflict do nothing;

insert into public.event_exams (event_id, exam_id, relevance)
select e.id, ex.id, 'high'
from public.current_events e, public.exams ex
where e.slug = 'india-becomes-4th-largest-economy'
  and ex.slug = 'ssc-gd'
on conflict do nothing;

-- ============================================
-- EVENT-CONCEPT MAPPINGS (link to knowledge graph)
-- ============================================

-- One Nation One Election → Fundamental Rights, Indian Parliament
insert into public.event_concepts (event_id, concept_id)
select e.id, c.id
from public.current_events e, public.concepts c
where e.slug = 'one-nation-one-election-bill-introduced'
  and c.slug = 'fundamental-rights'
on conflict do nothing;

insert into public.event_concepts (event_id, concept_id)
select e.id, c.id
from public.current_events e, public.concepts c
where e.slug = 'one-nation-one-election-bill-introduced'
  and c.slug = 'indian-parliament'
on conflict do nothing;

-- Chandrayaan-4 → Newton's Laws of Motion
insert into public.event_concepts (event_id, concept_id)
select e.id, c.id
from public.current_events e, public.concepts c
where e.slug = 'chandrayaan-4-mission-approved'
  and c.slug = 'newtons-laws-of-motion'
on conflict do nothing;
