/*
 * All routes for Customers are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

require("dotenv").config();

const RESTAURANT_PHONE = process.env.RESTAURANT_PHONE;

const { sendSMS } = require("../public/scripts/twilio");
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
    const id = req.session.id;
    addOrderHelper(orderData, id, db);

    // TO FIX: redirect after data is added in the for loop
    setTimeout(() => {
      res.send({ message: "success" });
    }, 200);
  });

  router.get("/order", authenticateUser, (req, res) => {
    const queryString = `
    SELECT ARRAY_AGG(name) menus, ARRAY_AGG(quantity) as quantities, id as order_id, to_char(sum(price)/100, 'FM9999.00') as total_price, order_placed_at, order_started_at, order_completed_at, customer_name, phone_number, email
    FROM (
      SELECT count(menus.name) as quantity, menus.name, SUM(menus.price) as price, orders.id, order_placed_at, order_started_at, order_completed_at,
      customers.name as customer_name, customers.phone_number as phone_number, customers.email as email
      FROM items_ordered
      JOIN orders ON orders.id = order_id
      JOIN customers ON customer_id = customers.id
      JOIN menus ON menu_id = menus.id
      WHERE customer_id = $1
      GROUP BY  menus.name, menus.price, orders.id, order_placed_at, order_started_at, order_completed_at,
      customers.name, customers.phone_number, customers.email
      ) AS orders
    GROUP BY id, order_placed_at, order_placed_at, order_started_at, order_completed_at, customer_name, phone_number, email
    ORDER BY order_id DESC;
    `;
    const queryParams = [req.session.id];
    db.query(queryString, queryParams).then((data) => {
      const orderDetails = data.rows;
      console.log("total orders: ", orderDetails.length);
      const customerDetails = [
        req.session.id,
        req.session.name,
        req.session.email,
      ];
      res.render("order", { orderDetails: orderDetails, user: req.session });
    });
  });

  router.post("/order/cancel", authenticateUser, (req, res) => {
    sendSMS(
      RESTAURANT_PHONE,
      `❌Order number ${req.body.order_id} has been cancelled❌`
    );

    const orderId = req.body.order_id;
    const queryString = `
      DELETE FROM orders
      WHERE id = $1;`;
    const queryParams = [orderId];

    db.query(queryString, queryParams)
      .then((data) => {
        res.send({ message: "order cancelled" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/order", authenticateUser, (req, res) => {
    const orderId = req.body.order_id;
    const queryString = `
      DELETE FROM orders
      WHERE id = $1;`;
    const queryParams = [orderId];
    db.query(queryString, queryParams)
      .then((data) => {
        res.send({ messgage: "order history deleted" });
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
function addOrderHelper(orderData, customerId, db) {
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

      sendSMS(
        RESTAURANT_PHONE,
        `🍕 A new order has been placed. The order number is ${data.rows[0].id}.`
      );
    })
    .catch((error) => {
      console.log(error);
    });
}
