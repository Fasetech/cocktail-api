const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");

const db = require("../lib/db.js");
const userMiddleware = require("../middleware/users.js");

// sign-up
router.post("/sign-up", userMiddleware.validateRegister, (req, res, next) => {
    db.query(`SELECT * FROM users WHERE LOWER(username) = LOWER(${db.escape(req.body.username)});`, (err, result) => {
        if (result.length) {
            return res.status(409).send({
                msg: "This username is already in use!",
            });
        } else {
            // username is available
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).send({
                        msg: err,
                    });
                } else {
                    // has hashed pw => add to database
                    db.query(
                        `INSERT INTO users (id, username, password, registered) VALUES ('${uuid.v4()}', 
                    ${db.escape(req.body.username)}, ${db.escape(hash)}, now())`,
                        (err, result) => {
                            if (err) {
                                return res.status(400).send({
                                    msg: err,
                                });
                            }
                            return res.status(201).send({
                                msg: "Registered!",
                            });
                        }
                    );
                }
            });
        }
    });
});

// login
router.post("/login", (req, res, next) => {
    db.query(`SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`, (err, result) => {
        // user does not exists
        if (err) {
            return res.status(400).send({
                msg: err,
            });
        }

        if (!result.length) {
            return res.status(401).send({
                msg: "Username or password is incorrect!",
            });
        }

        // check password
        bcrypt.compare(req.body.password, result[0]["password"], (bErr, bResult) => {
            // wrong password
            if (bErr) {
                return res.status(401).send({
                    msg: "Username or password is incorrect!",
                });
            }

            if (bResult) {
                const token = jwt.sign({
                        username: result[0].username,
                        userId: result[0].id,
                    },
                    "SECRETKEY", {
                        expiresIn: "7d",
                    }
                );

                db.query(`UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`);
                return res.status(200).send({
                    msg: "Logged in!",
                    token,
                    user: result[0],
                });
            }
            return res.status(401).send({
                msg: "Username or password is incorrect!",
            });
        });
    });
});

// delete
router.post("/delete", userMiddleware.isLoggedIn, (req, res, next) => {
    db.query(`DELETE FROM users WHERE username = '${req.userData.username}'`, (err, result) => {
        if (err) {
            return res.status(400).send({
                msg: err,
            });
        }
        return res.status(200).send({
            msg: "Deleted!",
        });
    });
});

// secret route
router.get("/secret-route", userMiddleware.isLoggedIn, (req, res, next) => {
    console.log(req.userData);
    res.send("This is the secret content. Only logged in users can see that!");
});

// get all users from database
router.get("/users", (req, res, next) => {
    db.query(`SELECT id, username FROM users`, (err, result) => {
        if (err) {
            return res.status(400).send({
                msg: err,
            });
        }
        return res.status(200).send({
            msg: "All users",
            users: result,
        });
    });
});

module.exports = router;