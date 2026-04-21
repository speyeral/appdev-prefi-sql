-- 1. Units of Measure Table

CREATE TABLE uom (

id BIGSERIAL PRIMARY KEY,

name VARCHAR(15) UNIQUE NOT NULL,

description TEXT

);


-- 2. Medical Test Categories Table

CREATE TABLE testcategories (

id BIGSERIAL PRIMARY KEY,

name VARCHAR(50) UNIQUE NOT NULL,

description TEXT

);


-- 3. Medical Tests Table

CREATE TABLE medicaltests (

id BIGSERIAL PRIMARY KEY,

name VARCHAR(50) UNIQUE NOT NULL,

description TEXT,

iduom BIGINT REFERENCES uom(id),

idcategory BIGINT REFERENCES testcategories(id),

normalmin REAL,

normalmax REAL

);