-- ============================================
-- Seed Data: Hindi translations for key concepts
-- ============================================
-- For Session 18: Multi-language support

insert into public.concept_translations (concept_id, language, title, summary, content_json)
select c.id, 'hi', 'प्रकाश संश्लेषण',
  'प्रकाश संश्लेषण वह प्रक्रिया है जिसमें हरे पौधे और कुछ जीव प्रकाश ऊर्जा को ग्लूकोज में संग्रहित रासायनिक ऊर्जा में परिवर्तित करते हैं।',
  jsonb_build_object(
    'definition', 'प्रकाश संश्लेषण वह प्रक्रिया है जिसमें हरे पौधे सूर्य के प्रकाश का उपयोग करके कार्बन डाइऑक्साइड और जल से भोजन का निर्माण करते हैं।',
    'key_facts', jsonb_build_array(
      'क्लोरोप्लास्ट में होता है',
      'समीकरण: 6CO2 + 6H2O + प्रकाश → C6H12O6 + 6O2',
      'दो चरण: प्रकाश अभिक्रिया और डार्क अभिक्रिया (कैल्विन चक्र)',
      'क्लोरोफिल मुख्य वर्णक है',
      'मुख्य रूप से पत्तियों में होता है'
    )
  )
from public.concepts c where c.slug = 'photosynthesis'
on conflict (concept_id, language) do nothing;

insert into public.concept_translations (concept_id, language, title, summary, content_json)
select c.id, 'hi', 'मौलिक अधिकार',
  'मौलिक अधिकार भारतीय संविधान (भाग III, अनुच्छेद 12-35) द्वारा सभी नागरिकों को गारंटीकृत बुनियादी मानव स्वतंत्रताएँ हैं।',
  jsonb_build_object(
    'definition', 'मौलिक अधिकार भारतीय संविधान के भाग III (अनुच्छेद 12 से 35) में मान्यता प्राप्त आवश्यक मानव स्वतंत्रताएँ हैं।',
    'key_facts', jsonb_build_array(
      'संविधान का भाग III (अनुच्छेद 12-35)',
      'मौलिक अधिकारों की 6 श्रेणियाँ',
      'अनुच्छेद 32: संवैधानिक उपचार का अधिकार',
      'मौलिक अधिकार न्यायसंगत हैं (न्यायालय द्वारा प्रवर्तनीय)',
      'आपातकाल के दौरान निलंबित किए जा सकते हैं (अनुच्छेद 20 और 21 को छोड़कर)'
    )
  )
from public.concepts c where c.slug = 'fundamental-rights'
on conflict (concept_id, language) do nothing;

insert into public.concept_translations (concept_id, language, title, summary, content_json)
select c.id, 'hi', 'पाइथागोरस प्रमेय',
  'समकोण त्रिभुज में, कर्ण का वर्ग अन्य दो भुजाओं के वर्गों के योग के बराबर होता है।',
  jsonb_build_object(
    'definition', 'समकोण त्रिभुज में, कर्ण (सबसे लंबी भुजा) का वर्ग अन्य दो भुजाओं के वर्गों के योग के बराबर होता है: a² + b² = c²।',
    'key_facts', jsonb_build_array(
      'सूत्र: a² + b² = c²',
      'केवल समकोण त्रिभुज पर लागू होता है',
      'c कर्ण है (सबसे लंबी भुजा, 90° के सामने)',
      'पाइथागोरस त्रिक: (3,4,5), (5,12,13), (8,15,17)'
    )
  )
from public.concepts c where c.slug = 'pythagoras-theorem'
on conflict (concept_id, language) do nothing;

insert into public.concept_translations (concept_id, language, title, summary, content_json)
select c.id, 'hi', 'न्यूटन के गति के नियम',
  'तीन मौलिक नियम जो किसी वस्तु और उस पर कार्य करने वाले बलों के बीच संबंध का वर्णन करते हैं।',
  jsonb_build_object(
    'definition', 'न्यूटन ने तीन नियम दिए जो वस्तुओं की गति और उन पर कार्य करने वाले बलों का वर्णन करते हैं।',
    'key_facts', jsonb_build_array(
      'प्रथम नियम (जड़त्व का नियम): वस्तु स्थिर या गति में रहेगी जब तक बाह्य बल न लगे',
      'द्वितीय नियम: F = ma (बल = द्रव्यमान × त्वरण)',
      'तृतीय नियम: हर क्रिया के बराबर और विपरीत प्रतिक्रिया होती है'
    )
  )
from public.concepts c where c.slug = 'newtons-laws-of-motion'
on conflict (concept_id, language) do nothing;
