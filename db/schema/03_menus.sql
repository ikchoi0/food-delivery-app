-- Drop and recreate menus table (Example)
DROP TABLE IF EXISTS menus CASCADE;
CREATE TABLE menus (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  photo_url TEXT,
  price SMALLINT NOT NULL
);
