/*
 * All routes for Authetications are defined here
 * Since this file is loaded in server.js into /,
 *   these routes are mounted onto /
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
module.exports = (db) => {
  router.post("/login", handleAlreadyLoggedIn, (req, res) => {
    const userInfo = req.body;
    let userEamil = userInfo.email;
    let userPassword = userInfo.password;
    console.log(userInfo);
    db.query(`SELECT * FROM customers WHERE email = $1`, [userEamil]).then(
      (data) => {
        const savedUserInfo = data.rows[0];
        // found customer from database
        if (savedUserInfo) {
          const dbUserPassword = savedUserInfo.password;
          bcrypt.compare(userPassword, dbUserPassword, function (err, result) {
            if (result) {
              req.session.id = savedUserInfo.id;
              req.session.email = savedUserInfo.email;
              req.session.name = savedUserInfo.name;
              req.session.phone_number = savedUserInfo.phone_number;
              req.session.loggedIn = true;
              if (req.session.email === "owner@owner.com") {
                return res.redirect("/api/owner");
              }
              return res.redirect("/api/menu");
            } else {
              res.send({ message: "invalid credentials" });
            }
          });
        } else {
          res.send({ message: "customer not found" });
        }
      }
    );
  });
  router.post("/register", handleAlreadyLoggedIn, (req, res) => {
    const userInfo = req.body;
    const userName = userInfo.name;
    const userEmail = userInfo.email;
    const userPhoneNumber = userInfo.phone_number;

    db.query(`SELECT * FROM customers WHERE email = $1;`, [userEamil]).then(
      (data) => {
        const savedUserInfo = data.rows[0];
        // found customer from database, send to login page
        if (savedUserInfo) {
          return res.redirect("/");
        }
        bcrypt.hash(userInfo.password, saltRounds, function (err, hash) {
          db.query(
            `
              INSERT INTO customers
              VALUES ($1, $2 $3, $4)
              RETURNING id, name, email, phone_number;
            `,
            [userName, userEmail, userPhoneNumber, hash]
          ).then((data) => {
            const savedUserInfo = data.rows[0];
            console.log(savedUserInfo);

            req.session.name = userInfo;
            req.session.email = userName;
            req.session.phone_number = userPhoneNumber;
            req.session.loggedIn = true;
          });
        });
      }
    );
  });
  return router;
};

function handleAlreadyLoggedIn(req, res, next) {
  if (req.session.loggedIn) {
    if (req.session.email === "owner@owner.com") {
      return res.redirect("/api/owner");
    }
    return res.redirect("/api/menu");
  } else {
    next();
  }
}
