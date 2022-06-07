/*
 * All routes for Customers are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../lib/auth-helper");
module.exports = (db) => {
  router.get("/", authenticateUser, (req, res) => {
    db.query(`SELECT * FROM menus;`)
      .then((data) => {
        const menus = data.rows;
        res.render("menu", { menus: menus, user: req.session });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/", authenticateUser, (req, res) => {
    const orderData = req.body;
    const customerName = orderData.customer_name;
    const customerEmail = orderData.customer_email;
    const customerPhoneNumber = orderData.customer_phone_number;
    ["customer_name", "customer_email", "customer_phone_number"].forEach(
      (key) => delete orderData[key]
    );
    db.query(`SELECT id FROM customers WHERE email = $1;`, [
      customerEmail,
    ]).then((data) => {
      if (data.rows.length) {
        addOrderHelper(orderData, data, db);
      } else {
        db.query(
          `
            INSERT INTO customers (name, email, phone_number)
            VALUES ($1, $2, $3)
            RETURNING id;
          `,
          [customerName, customerEmail, customerPhoneNumber]
        ).then((data) => {
          addOrderHelper(orderData, data, db);
        });
      }
    });
    // TO FIX: redirect after data is added in the for loop
    setTimeout(() => {
      res.send({ message: "success" });
    }, 1000);
  });

  router.get("/order", authenticateUser, (req, res) => {
    db.query(
      `
      SELECT menu_id, menus.name as item_name, to_char(menus.price/100, 'FM99.00') as price, orders.id, order_placed_at, order_started_at, order_completed_at,
      customers.name as customer_name, customers.phone_number as phone_number, customers.email as email, count(*) as cnt
      FROM items_ordered
      JOIN orders ON orders.id = order_id
      JOIN customers ON customer_id = customers.id
      JOIN menus ON menu_id = menus.id
      WHERE order_id = (SELECT id FROM orders ORDER BY order_placed_at DESC LIMIT 1) AND customer_id = $1
      GROUP BY menu_id, menus.name, menus.price, orders.id, order_placed_at, order_started_at, order_completed_at,
      customers.name, customers.phone_number, customers.email;
      `, queryParams
    ).then((data) => {
      const orderDetails = data.rows;
      console.log('order details', orderDetails, 'customer details', customerDetails);
      res.render("order", { orderDetails: orderDetails , user: req.session });
    });
  });

  router.post("/delete", authenticateUser, (req, res) => {
    db.query(
      `
    SELECT orders.*, items_ordered.*
    FROM items_ordered
    JOIN orders ON orders.id = order_id
    JOIN customers ON customer_id = customers.id
    JOIN menus ON menu_id = menus.id
    WHERE order_id in (SELECT id FROM orders WHERE customer_id = (SELECT customer_id FROM orders ORDER BY order_placed_at DESC LIMIT 1));
    `
    )
      .then((data) => {
        const cancelledOrder = data.rows;
        delete cancelledOrder;
        res.redirect("/api/menu");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};

// GET request to load menu
// POST request to submit form with all added menu items and name/email/phone
// triggers notification to owner that the order has been placed
// POST request to cancel form (either redirect or clear same page)

function addOrderHelper(orderData, data, db) {
  const customerId = Number(data.rows[0].id);
  console.log(customerId);
  db.query(
    `
      INSERT INTO orders (customer_id, order_placed_at)
      VALUES ($1, NOW())
      RETURNING id;
    `,
    [customerId]
  )
    .then((data) => {
      for (let key of Object.keys(orderData)) {
        const quantity = Number(orderData[key]);
        for (let i = 0; i < quantity; i++) {
          db.query(
            `
              INSERT INTO items_ordered (order_id, menu_id)
              VALUES ($1, $2)
            `,
            [Number(data.rows[0].id), Number(key)]
          );
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
