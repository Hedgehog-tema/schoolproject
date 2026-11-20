-- Sample content so the site isn't empty on first run.
-- Replace / edit freely through a future admin panel or directly in the DB.

INSERT INTO books (slug, title, subtitle, description, cover_image_url, price_cents, published_date, featured)
VALUES (
  'toppotassut',
  'Töppötassut',
  'Suuri seikkailu',
  'Esikoisteos. Lämminhenkinen kuvakirja lapsille — tarina pienestä töppötassu-hahmosta ja suuresta seikkailusta. Momentum kirjat, julkaistu 21.9.2023.',
  'https://static.wixstatic.com/media/5b46f2_2e86ee39662c45248c7dcf64bd8aaa67~mv2.jpg/v1/fill/w_590,h_832,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/t%C3%B6pp%C3%B6tassut_kansi.jpg',
  18,
  '2023-09-21',
  true
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO materials (title, description, file_url, requires_login)
VALUES
  ('Töppötassujen lukuhetki – keskustelua, leikkiä ja tunnetaitoja (päiväkodeille)',
   'Valmis tuokiomateriaali päiväkoteihin: keskustelukysymyksiä, tunneharjoituksia sekä leikki- ja askarteluideoita kirjan ympärille.',
   'https://a8a5af9e-60fe-4834-84bf-0c2be73c2eee.filesusr.com/ugd/5b46f2_90767fe9775448aaa4ecd7bafe28466e.pdf',
   false),
  ('Värityskuvat: Töppötassu', 'Tulostettavat värityskuvat kirjan hahmoista.', '/materials/varityskuvat.pdf', true),
  ('Opettajan tehtävämoniste', 'Lukupiirin ja luokan tehtäviä kirjan ympärille.', '/materials/tehtavamoniste.pdf', true)
ON CONFLICT (title) DO NOTHING;

INSERT INTO blog_posts (slug, title, excerpt, content, cover_image_url, source_url, source_label)
VALUES (
  'toppotassut-lehdissa',
  'Töppötassut lehdissä',
  'Kirja on saanut mukavasti huomiota paikallislehdissä.',
  'Töppötassut on ollut esillä useissa lehdissä ja kouluvierailuilla ympäri Turkua. Kiitos kaikille lukijoille ja tukijoille!',
  'https://placehold.co/800x450/4fa89b/ffffff?text=Lehtijuttu',
  NULL,
  NULL
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (slug, title, excerpt, content, cover_image_url, source_url, source_label)
VALUES (
  'mielikuvitus-vain-rajana',
  'Mielikuvitus vain rajana – turkulaiset kolmasluokkalaiset innostuivat Töppötassuista',
  'Turun Seutusanomat kirjoitti, kuinka turkulaiset kolmasluokkalaiset innostuivat Töppötassuista kouluvierailulla.',
  'Turun Seutusanomat vieraili koululla, jossa kolmasluokkalaiset pääsivät tutustumaan Töppötassut-kirjaan ja sen maailmaan. Mielikuvitus sai lentää, ja lapset innostuivat kirjan hahmoista ja tarinoista. Lue koko juttu alta.',
  'https://static.wixstatic.com/media/5b46f2_81158eb326fc489eae0f6aed98425917~mv2.jpg/v1/fill/w_526,h_377,al_c,q_80,enc_avif,quality_auto/660949020_17954936664092712_4267484372974853935_n%20aamuset.jpg',
  'https://turunseutusanomat.fi/2024/06/mielikuvitus-vain-rajana-kolmasluokkalaiset-innostuivat-toppotassuista/',
  'Turun Seutusanomat'
) ON CONFLICT (slug) DO NOTHING;

-- Note: the book cover image is deliberately NOT repeated here (it already
-- has its own place on the book page), to avoid showing the same picture twice.
INSERT INTO gallery_images (image_url, caption, sort_order) VALUES
  ('https://static.wixstatic.com/media/5b46f2_1b68942bd8cf442e9f61be08ee2af488~mv2.jpg/v1/fill/w_181,h_127,al_c,q_80,usm_0.66_1.00_0.01/5b46f2_1b68942bd8cf442e9f61be08ee2af488~mv2.jpg', 'Yhteinen kortinpeluuilta', 1),
  ('https://static.wixstatic.com/media/5b46f2_0b40247cf49b4e798b1ebccd05d2e9f7~mv2.jpg/v1/fill/w_181,h_193,al_c,q_80,usm_0.66_1.00_0.01/5b46f2_0b40247cf49b4e798b1ebccd05d2e9f7~mv2.jpg', 'Jäätelömakujen valinta', 2),
  ('https://static.wixstatic.com/media/5b46f2_e0d563db92924560bdeb2a33c91485d7~mv2.jpg/v1/fill/w_181,h_263,al_c,q_80,usm_0.66_1.00_0.01/5b46f2_e0d563db92924560bdeb2a33c91485d7~mv2.jpg', 'Koneen siivellä', 3),
  ('https://static.wixstatic.com/media/5b46f2_fa470c48b3ac4109b41e3940f98eb25a~mv2.jpg/v1/fill/w_181,h_255,al_c,q_80,usm_0.66_1.00_0.01/5b46f2_fa470c48b3ac4109b41e3940f98eb25a~mv2.jpg', 'Laskuvarjohyppy Etnan juurelle', 4),
  ('https://static.wixstatic.com/media/5b46f2_de3db8e5216e4f20a1b9ed940d77c7f0~mv2.jpg/v1/fill/w_181,h_127,al_c,q_80,usm_0.66_1.00_0.01/5b46f2_de3db8e5216e4f20a1b9ed940d77c7f0~mv2.jpg', 'Liukumäki tulivuoren huipulta', 5),
  ('https://static.wixstatic.com/media/5b46f2_a8b58eee7e92410ca1aef47ba7c0ab73~mv2.jpg/v1/fill/w_181,h_255,al_c,q_80,usm_0.66_1.00_0.01/5b46f2_a8b58eee7e92410ca1aef47ba7c0ab73~mv2.jpg', 'Paikallisen aasin vierailu', 6),
  ('https://static.wixstatic.com/media/5b46f2_ed98fdeb853243ebac3d0316ad21b91d~mv2.jpg/v1/fill/w_181,h_255,al_c,q_80,usm_0.66_1.00_0.01/5b46f2_ed98fdeb853243ebac3d0316ad21b91d~mv2.jpg', 'Töppötassut-kuusikko yhdessä', 7),
  ('https://static.wixstatic.com/media/5b46f2_f9c0536d6dd3418d83b397090fe82992~mv2.jpg/v1/fill/w_405,h_573,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/5b46f2_f9c0536d6dd3418d83b397090fe82992~mv2.jpg', 'Kuvitusta kirjasta', 8),
  ('https://static.wixstatic.com/media/5b46f2_690057fe16b74dd7a4677e82429ec3f7~mv2.jpg/v1/fill/w_825,h_573,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/5b46f2_690057fe16b74dd7a4677e82429ec3f7~mv2.jpg', 'Kuvitusta kirjasta', 9),
  ('https://static.wixstatic.com/media/5b46f2_07ab001cac554712b18c02ac1c2da3c6~mv2.jpg/v1/fill/w_398,h_573,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/5b46f2_07ab001cac554712b18c02ac1c2da3c6~mv2.jpg', 'Kuvitusta kirjasta', 10),
  ('https://static.wixstatic.com/media/5b46f2_69de2be169da4b7da98920be3cca2d4b~mv2.jpg/v1/fill/w_599,h_573,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/5b46f2_69de2be169da4b7da98920be3cca2d4b~mv2.jpg', 'Kuvitusta kirjasta', 11)
ON CONFLICT (image_url) DO NOTHING;
