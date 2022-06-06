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
    const orders = [];

    db.query(`
      SELECT orders.id AS order_id, ARRAY_AGG(menus.name) AS menu_name, COUNT(menus.*) AS total_items, orders.order_placed_at AS placed_time
      FROM orders
      JOIN items_ordered ON orders.id = items_ordered.order_id
      JOIN menus ON menus.id = items_ordered.menu_id
      JOIN customers ON customers.id = orders.customer_id
      GROUP BY orders.id;
         `
    ).then(data => {
      orders.push(...data.rows);
      res.render('owner', { orders: orders });
    }).catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });

  router.post("/decline", (req, res) => {
    const { orderId } = req.body;
    db.query(`DELETE FROM orders WHERE id = $1;`, [orderId]).then(data => {
      res.send(data.rows[0]);
    })
  })

  router.post("/confirm", (req, res) => {
    const { orderId, confirm_time } = req.body;
    db.query(`UPDATE orders
    SET order_started_at = NOW()
    WHERE id = $1 RETURNING *;`, [orderId]
    ).then(data => {
      res.send({data: data.rows[0], confirm_time});
    })

    router.post("/confirm/completed", (req, res) => {
      const { completedId } = req.body;
      db.query(`UPDATE orders
       SET order_completed_at = NOW()
       WHERE id = $1 RETURNING *;
       `, [completedId]).then(data => {
        res.send(data.rows);
      })
    })

  })



  return router;
};

// GET request when order is created that triggers an SMS notification
// POST request for the owner to update the order time via SMS or webpage
  // triggers a notification to customer on when order is ready
