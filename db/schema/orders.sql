-- Drop and recreate orders table (Example)
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  order_placed_at TIMESTAMP NOT NULL,
  order_completed_at TIMESTAMP,
  total_price SMALLINT NOT NULL
);
