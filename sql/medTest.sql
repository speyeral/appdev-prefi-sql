INSERT INTO medicaltests 
(name, iduom, idcategory, normalmin, normalmax)
VALUES
(
  'Fasting Blood Glucose',
  (SELECT id FROM uom WHERE name = 'mg/dL'),
  (SELECT id FROM testcategories WHERE name = 'BCT'),
  70, 99
),
(
  'Hemoglobin Male',
  (SELECT id FROM uom WHERE name = 'g/dL'),
  (SELECT id FROM testcategories WHERE name = 'CBC'),
  13.5, 17.5
),
(
  'Hemoglobin Female',
  (SELECT id FROM uom WHERE name = 'g/dL'),
  (SELECT id FROM testcategories WHERE name = 'CBC'),
  12.5, 15.5
),
(
  'White Blood Cell Count',
  (SELECT id FROM uom WHERE name = 'cells/µL'),
  (SELECT id FROM testcategories WHERE name = 'CBC'),
  4000, 11000
),
(
  'Alanine Aminotransferase',
  (SELECT id FROM uom WHERE name = 'IU/L'),
  (SELECT id FROM testcategories WHERE name = 'LFT'),
  7, 56
);