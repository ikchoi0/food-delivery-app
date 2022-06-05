INSERT INTO customers (name, email, phone_number)
VALUES ('Tom', 'tom88@gmail.com', '416-224-8806'),
('Emma', 'emem@gmail.com', '437-217-2607'),
('Nina', 'ninja@yahoo.com', '416-445-0808'),
('Chris', 'chrishan@naver.com', '905-334-7865'),
('Noze', 'nojin@google.com', '416-223-7649');

INSERT INTO orders (customer_id, order_placed_at, order_started_at)
VALUES (1, '2022-05-21 12:32:45', '2022-05-21 12:33:11'),
(2, '2022-05-28 17:12:31', '2022-05-28 17:14:27'),
(2, '2022-05-28 17:12:31', '2022-05-28 17:13:27'),
(3, '2022-05-28 14:23:40', '2022-05-28 14:24:22'),
(4, '2022-06-01 18:34:21', '2022-06-01 18:35:02'),
(5, '2022-06-03 20:43:22', '2022-06-03 20:44:22');


INSERT INTO menus (name, description, photo_url, price)
VALUES ('Chipotle Lobster', 'Japanese Milk Bread, Folded Eggs, Lobster, Bacon, Corn, Lettuce, Chipootle sauce', 'https://media.blogto.com/articles/20201211-EggClub-9.jpg?w=720&cmd=resize_then_crop&height=480&quality=70',1300),
('Creamy Corn Salsa', 'Japanese Milk Bread, Folded Eggs, Corn Salsa, Creamy Chili Sauce', 'https://lh3.googleusercontent.com/j2rMXWFVo0sQgm2u5OrT0JTu6pP3EMOibTD2ZlUdLcU1zg9p9jHppphOadvMPOp2cnSc86fG31KiTrh02LW5PbTS2fQ', 1100),
('Karubi Don	Angus', 'boneless beef short rib, onion. Grilled and broiled meat on top of Japanese short grain rice (fresh meat fresh grill).',	'https://img.cdn4dd.com/p/fit=cover,width=600,format=auto,quality=50/media/photos/4e1121d6-b571-4958-b74b-759f9e7b9d30-retina-large-jpeg',	2459),
('Karaage', 'Japanese popcorn chicken', 'https://img.cdn4dd.com/p/fit=cover,width=600,format=auto,quality=50/media/photos/857f6c57-235f-4045-bc6f-723fb945b557-retina-large-jpeg', 875),
('Gyu Don', 'Beef slice, onion, beni-shoga.', 'https://img.cdn4dd.com/p/fit=cover,width=600,format=auto,quality=50/media/photos/6288f7ef-8f04-4c9f-a828-1946d6510426-retina-large-jpeg', 1789),
('Katsu Don', 'Panko fried pork or chicken, egg mixture, onion.', 'https://img.cdn4dd.com/p/fit=cover,width=600,format=auto,quality=50/media/photos/a78f6277-fe43-4635-8b9c-e34a5f8adb13-retina-large-jpeg', 1789),
('Ton-Toro Don', 'Pork jowl meat, onion. Grilled and broiled meat on top of Japanese short grain rice (fresh meat fresh grill).', 'https://img.cdn4dd.com/p/fit=cover,width=600,format=auto,quality=50/media/photos/d6af64b4-c40b-48ac-a3de-66ec2dafe1bb-retina-large-jpeg', 1829),
('Sake - Oshizushi', 'Blowtorched Atlantic salmon, furikake, tobiko, green onion, sushi rice.', 'https://img.cdn4dd.com/p/fit=cover,width=600,format=auto,quality=50/media/photos/aa091e62-c159-4239-b566-4035983ed95f-retina-large-jpeg', 1789),
('Miso Salmon Don', 'Miso cured Atlantic salmon.', 'https://img.cdn4dd.com/p/fit=cover,width=600,format=auto,quality=50/media/photos/9eb2d1b7-08b8-4349-adfe-0973bd4d347b-retina-large-jpeg', 1889),
('yakiniku don', 'grill marinated boneless Angus beef short rib, onion.', 'https://img.cdn4dd.com/p/fit=cover,width=600,format=auto,quality=50/media/photos/630c6b3f-ebc8-4d99-9118-fa87e9f5f83b-retina-large-jpeg', 2259);

INSERT INTO items_ordered (order_id, menu_id)
VALUES (1, 2),
(2, 1),
(3, 6),
(4, 5),
(5, 8);

