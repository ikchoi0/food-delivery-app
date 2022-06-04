/*
 * All routes for Owner are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT order_id, menu_id, customers.phone_number AS phone, orders.customer_id AS customer, orders.order_placed_at AS order_time FROM items_ordered JOIN orders ON orders.id = order_id JOIN customers ON customers.id = orders.customer_id;`)
      .then(data => {
        const orders = data.rows;
        res.render('owner', {orders: orders});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });
  return router;
};

// GET request when order is created that triggers an SMS notification
// POST request for the owner to update the order time via SMS or webpage
  // triggers a notification to customer on when order is ready
