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
const {handleAlreadyLoggedIn, authenticateUser} = require("../lib/auth-helper");
module.exports = (db) => {
  router.post("/login", handleAlreadyLoggedIn, (req, res) => {
    const userInfo = req.body;
    db.query(`SELECT * FROM customers WHERE email = $1`, [userInfo.email]).then(
      (data) => {
        const savedUserInfo = data.rows[0];
        // found customer from database
        if (savedUserInfo) {
          const dbUserPassword = savedUserInfo.password;
          bcrypt.compare(userInfo.password, dbUserPassword, function (err, result) {
            if (result) {
              req.session.id = savedUserInfo.id;
              req.session.email = savedUserInfo.email;
              req.session.name = savedUserInfo.name;
              req.session.phone_number = savedUserInfo.phone_number;
              req.session.loggedIn = true;
              if (req.session.email === "owner@owner.com") {
                // return res.redirect("/api/owner");
                return res.status(200).json({logged_in_as: "owner",message:"success"})
              }
              return res.status(200).json({logged_in_as: "customer", message:"success"})
              // return res.redirect("/api/menu");
            } else {
              return res.status(401).json({logged_in_as: "", message: "Incorrect password"})
            }
          });
        } else {
          return res.status(401).json({logged_in_as: "", message: "Email not found"})
        }
      }
    );
  });
  router.get("/register", handleAlreadyLoggedIn, (req, res) => {
    res.render("register", {user: req.session});
  });
  router.post("/register", handleAlreadyLoggedIn, (req, res) => {
    const userInfo = req.body;
    const userName = userInfo.name;
    const userEmail = userInfo.email;
    const userPhoneNumber = userInfo.phone_number;
    console.log(userInfo);
    db.query(`SELECT * FROM customers WHERE email = $1;`, [userEmail]).then(
      (data) => {
        const savedUserInfo = data.rows[0];

        // found customer from database, send to login page
        if (savedUserInfo) {
          return res.status(401).json({logged_in_as: "", message: "email is already registered"})
        }
        bcrypt.hash(userInfo.password, saltRounds, function (err, hash) {
          db.query(
            `
              INSERT INTO customers (name, email, phone_number, password)
              VALUES ($1, $2, $3, $4)
              RETURNING id, name, email, phone_number;
            `,
            [userName, userEmail, userPhoneNumber, hash]
          ).then((data) => {
            const savedUserInfo = data.rows[0];
            req.session.id = savedUserInfo.id;
            req.session.email = savedUserInfo.email;
            req.session.name = savedUserInfo.name;
            req.session.phone_number = savedUserInfo.phone_number;
            req.session.loggedIn = true;
            return res.redirect("/api/menu");
          });
        });
      }
    );
  });
  router.post("/logout", authenticateUser, (req, res) => {
    req.session = null;
    res.send({"message": "ok"});
  });
  return router;
};
