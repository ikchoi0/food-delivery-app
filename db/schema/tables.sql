-- Drop and recreate customers table (Example)
DROP TABLE IF EXISTS customers CASCADE;
CREATE TABLE customers (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(32) NOT NULL
);

-- Drop and recreate orders table (Example)
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  order_placed_at TIMESTAMP NOT NULL,
  order_completed_at TIMESTAMP,
  total_price SMALLINT NOT NULL
);

-- Drop and recreate menus table (Example)
DROP TABLE IF EXISTS menus CASCADE;
CREATE TABLE menus (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  photo_url TEXT,
  price SMALLINT NOT NULL
);

-- Drop and recreate items_ordered table (Example)
DROP TABLE IF EXISTS items_ordered CASCADE;
CREATE TABLE items_ordered (
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE
);
