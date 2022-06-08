-- Drop and recreate items_ordered table (Example)
DROP TABLE IF EXISTS items_ordered CASCADE;
CREATE TABLE items_ordered (
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE
);
