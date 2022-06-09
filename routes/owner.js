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

  // get the menu items in the owner menu page
  router.get("/menu", authenticateUser, authenticateOwner, (req, res) => {
    db.query(`SELECT * FROM menus ORDER BY id;`)
      .then((data) => {
        const menus = data.rows;
        res.render("owner_menu", { menus: menus, user: req.session });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });


//after edit event happens, update the table
  router.post("/menu/edit", authenticateUser, authenticateOwner, (req, res) => {
    const {
      menu_id,
      edit_menu_name,
      edit_menu_photo_url,
      edit_menu_description,
      edit_menu_price,
    } = req.body;
    if (edit_menu_price === NaN) {
      return res.redirect("api/owner/menu/create");
    } else {
      console.log(edit_menu_description);
      db.query(
        `
          UPDATE menus
          SET name = $1, photo_url = $2, description = $3, price = $4
          WHERE id = $5
        `,
        [
          edit_menu_name,
          edit_menu_photo_url,
          edit_menu_description,
          Number(edit_menu_price * 100),
          menu_id,
        ]
      )
        .then(() => {
          return res.status(200).json({ message: "success" });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
  router.get(
    "/menu/create",
    authenticateUser,
    authenticateOwner,
    (req, res) => {
      res.render("add_menu", { user: req.session });
    }
  );

// creating items in the menu sidebar
  router.post("/menu", authenticateUser, authenticateOwner, (req, res) => {
    const {
      create_menu_name,
      create_menu_photo_url,
      create_menu_description,
      create_menu_price,
    } = req.body;
    if (create_menu_price === NaN) {
      return res.redirect("api/owner/menu/create");
    } else {
      db.query(
        `
          INSERT INTO menus (name, photo_url, description, price)
          VALUES ($1, $2, $3, $4);
        `,
        [
          create_menu_name,
          create_menu_photo_url,
          create_menu_description,
          Number(create_menu_price * 100),
        ]
      )
        .then(() => {
          res.redirect("/api/owner");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });

// get orders that customers make
  router.get("/", authenticateUser, authenticateOwner, (req, res) => {
    const orders = [];

    db.query(
      `
        SELECT orders.id AS order_id, customers.name, ARRAY_AGG(menus.name) AS menu_name, COUNT(menus.*) AS total_items, orders.order_placed_at AS placed_time, order_started_at, order_completed_at
        FROM orders
        JOIN items_ordered ON orders.id = items_ordered.order_id
        JOIN menus ON menus.id = items_ordered.menu_id
        JOIN customers ON customers.id = orders.customer_id
        GROUP BY orders.id, customers.name
        ORDER BY orders.id DESC;
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

// delete data from orders table when decline event happened
  router.post(
    "/order/decline",
    authenticateUser,
    authenticateOwner,
    (req, res) => {
      const { orderId } = req.body;
      orderDeclineSMS(req.body.orderId, db);
      db.query(`DELETE FROM orders WHERE id = $1;`, [orderId]).then((data) => {
        res.send(data.rows[0]);
      });
    }
  );

  //when an order is confirmed, update started_at time in the table
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
        `,
        [orderId]
      ).then((data) => {
        orderConfirmSMS(data.rows[0].id, db);
        res.send({ data: data.rows[0] });
      });
    }
  );

// show completed orders
  router.get(
    "/order/complete",
    authenticateUser,
    authenticateOwner,
    (req, res) => {
      const orders = [];

      db.query(
        `
        SELECT orders.id AS order_id, customers.name, ARRAY_AGG(menus.name) AS menu_name, COUNT(menus.*) AS total_items, orders.order_placed_at AS placed_time, order_started_at, order_completed_at
        FROM orders
        JOIN items_ordered ON orders.id = items_ordered.order_id
        JOIN menus ON menus.id = items_ordered.menu_id
        JOIN customers ON customers.id = orders.customer_id
        GROUP BY orders.id, customers.name
        ORDER BY orders.id DESC;
      `
      )
        .then((data) => {
          orders.push(...data.rows);
          res.render("owner_order_completed", {
            orders: orders,
            user: req.session,
          });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    }
  );

  // update completed time when the completed button submitted
  router.post(
    "/order/complete",
    authenticateUser,
    authenticateOwner,
    (req, res) => {
      const { orderId } = req.body;
      db.query(
        `
          UPDATE orders
          SET order_completed_at = NOW()
          WHERE id = $1 RETURNING *;
        `,
        [orderId]
      ).then((data) => {
        orderCompleteSMS(data.rows[0].id, db);
        res.send(data.rows);
      });
    }
  );
  return router;
};

// GET request when order is created that triggers an SMS notification
// POST request for the owner to update the order time via SMS or webpage
// triggers a notification to customer on when order is ready

// helper function to send sms to customer
function orderCompleteSMS(order_id, db) {
  db.query(
    `SELECT phone_number, orders.id
    FROM customers JOIN orders ON customers.id = customer_id
    WHERE orders.id = $1;`,
    [order_id]
  )
    .then((data) => {
      const phone_number = data.rows[0].phone_number;
      sendSMS(
        phone_number,
        `🍕 Order #${data.rows[0].id} is ready for pickup.`
      );
    })
    .catch((error) => {
      console.log(error);
    });
}

function orderConfirmSMS(order_id, db) {
  db.query(
    `SELECT phone_number, orders.id
    FROM customers JOIN orders ON customers.id = customer_id
    WHERE orders.id = $1;`,
    [order_id]
  )
    .then((data) => {
      const phone_number = data.rows[0].phone_number;
      sendSMS(
        phone_number,
        `🍕 Order #${data.rows[0].id} has been confirmed by the restaurant.`
      );
    })
    .catch((error) => {
      console.log(error);
    });
}

function orderDeclineSMS(order_id, db) {
  db.query(
    `SELECT phone_number, orders.id
    FROM customers JOIN orders ON customers.id = customer_id
    WHERE orders.id = $1;`,
    [order_id]
  )
    .then((data) => {
      const phone_number = data.rows[0].phone_number;
      sendSMS(
        phone_number,
        `❌Order #${data.rows[0].id} has been declined by the restaurant❌`
      );
    })
    .catch((error) => {
      console.log(error);
    });
}
