/*
 * All routes for Authetications are defined here
 * Since this file is loaded in server.js into /,
 *   these routes are mounted onto /
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports = (db) => {
  router.post("/login", (req, res) => {
    if (req.session.loggedIn) {
      return res.redirect("/api/menu");
    } else {
      const userInfo = req.body;
      const email = userInfo.email;
      let password = userInfo.password;
      let userId, phone_number, name;

      db.query(`SELECT * FROM customers WHERE email = $1`, [email])
      .then(data => {
        const savedUserInfo = data.rows[0];
        // found customer from database
        if(savedUserInfo) {
          userId = savedUserInfo.id;
          bcrypt.compare(password, function(err, result) {
            if (result) {
              req.session.email = savedUserInfo.email;
              req.session.name = savedUserInfo.name;
              req.session.phone_number = savedUserInfo.phone_number;
              req.session.loggedIn = true;
              res.send({"message": "logged in"});
            } else {
              res.send({"message": "invalid credentials"});
            }
          });
        } else {
          bcrypt.hash(password, saltRounds, function(err, hash) {

          });
          res.send({"message": "customer not found"})
        }
      })
    }
  });
  return router;
}
