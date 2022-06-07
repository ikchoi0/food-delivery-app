/*
 * All routes for Owner are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const { sendSMS } = require("../public/scripts/twilio");
const express = require("express");
const router = express.Router();
const { authenticateUser, authenticateOwner } = require("../lib/auth-helper");

module.exports = (db) => {
  router.get(
    "/menu/create",
    authenticateUser,
    authenticateOwner,
    (req, res) => {
      res.render("add_menu", { user: req.session });
    }
  );
  router.post("/menu", (req, res) => {
    const {
      create_menu_name,
      create_menu_photo_url,
      create_menu_description,
      create_menu_price,
    } = req.body;
    db.query(
      `
        INSERT INTO menus (name, photo_url, description, price)
        VALUES ($1, $2, $3, $4);
      `,
      [
        create_menu_name,
        create_menu_photo_url,
        create_menu_description,
        Number(create_menu_price),
      ]
    )
      .then(() => {
        res.redirect("/api/owner");
      })
      .catch((error) => {
        console.log(error);
      });
  });

  router.get("/", authenticateUser, authenticateOwner, (req, res) => {
    const orders = [];

    db.query(
      `
        SELECT orders.id AS order_id, ARRAY_AGG(menus.name) AS menu_name, COUNT(menus.*) AS total_items, orders.order_placed_at AS placed_time, order_started_at, order_completed_at
        FROM orders
        JOIN items_ordered ON orders.id = items_ordered.order_id
        JOIN menus ON menus.id = items_ordered.menu_id
        JOIN customers ON customers.id = orders.customer_id
        GROUP BY orders.id;
      `
    )
    .then((data) => {
      orders.push(...data.rows);
      res.render("owner", { orders: orders, user: req.session });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
  });

  router.post("/decline", authenticateUser, authenticateOwner, (req, res) => {
    const { orderId } = req.body;
    db.query(`DELETE FROM orders WHERE id = $1;`, [orderId]).then((data) => {
      res.send(data.rows[0]);
    });
  });

  router.post(
    "/order/confirm",
    authenticateUser,
    authenticateOwner,
    (req, res) => {
      const { orderId } = req.body;
      db.query(
        `
          UPDATE orders
          SET order_started_at = NOW()
          WHERE id = $1
          RETURNING *;
        `, [orderId]
      )
      .then((data) => {
        res.send({ data: data.rows[0] });
      });
    }
  );

  router.post(
    "/order/complete",
    authenticateUser,
    authenticateOwner,
    (req, res) => {;
      const { orderId } = req.body;
      db.query(
        `
          UPDATE orders
          SET order_completed_at = NOW()
          WHERE id = $1 RETURNING *;
        `, [orderId]
      )
      .then((data) => {
        console.log('data', data.rows[0].customer_id);
        const phone_number = db.query(
          `SELECT phone_number
          FROM customers
          WHERE customers.id = $1;`, [data.rows[0].customer_id]
          );
        console.log(phone_number);
        sendSMS(
          phone_number,
          `🍕 Order #${data.rows[0].id} is ready for pickup.`
        );
        res.send(data.rows);
      })

    }
  );
  return router;
};

// GET request when order is created that triggers an SMS notification
// POST request for the owner to update the order time via SMS or webpage
// triggers a notification to customer on when order is ready
