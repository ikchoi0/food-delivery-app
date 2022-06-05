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
    const array = [];

    db.query(`
          SELECT order_id, menus.name AS item, COUNT(menus.*), customers.id AS customer, customers.phone_number AS phone, orders.order_placed_at AS order_time
          FROM items_ordered
            JOIN orders ON orders.id = order_id
            JOIN customers ON customers.id = orders.customer_id
            JOIN menus ON menus.id = items_ordered.menu_id
            GROUP BY menus.name, order_id,
            customers.id, orders.order_placed_at;
            `
    ).then(data => {
      array.push(...data.rows);
      const obj = {};
      for (let element of array) {
        obj[element.customer] ? obj[element.customer].push(element) : obj[element.customer] = [element];
      }
      console.log(obj);
      res.render('owner', { orders: obj });
    }).catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });

  router.post("/decline", (req, res) => {

    db.query(
      `
      DELETE orders WHERE (order_completed_at)
      `
    ).then(() => {
      res.redirect("/")
    })
  })


  return router;
};

// GET request when order is created that triggers an SMS notification
// POST request for the owner to update the order time via SMS or webpage
  // triggers a notification to customer on when order is ready
