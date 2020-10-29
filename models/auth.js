const db = require('../db/database.js');
const validator = require('email-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const user = require('./user.js');

try {
    config = require('../config/config.json');
} catch (error) {
    console.error(error);
}

const jwtSecret = process.env.JWT_SECRET || config.secret;

const auth = {
    checkToken: function(req, res, next) {
        const token = req.headers['x-access-token'];

        if (!token) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    title: "No token",
                    detail: "No jwt-token provided in headers"
                }
            });
        }

        jwt.verify(token, jwtSecret, function(err, decoded) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: "Authentication failed",
                        detail: "The token you provided is not valid."
                    }
                });
            }

            next();
            return undefined;
        });
    },

    login: function(res, body) {
        const email = body.email;
        const password = body.password;

        if (!email || !validator.validate(email)) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email missing",
                    detail: "Email missing in request or is invalid"
                }
            });
        }

        if (!password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Password missing",
                    detail: "Password missing in request"
                }
            });
        }

        const sql = `SELECT * FROM users WHERE email = ?;`;

        db.get(sql, email, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: "Database error",
                        detail: "Error while running SQL-command"
                    }
                });
            }

            if (rows === undefined) {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        title: "Failed to find user",
                        detail: `User with name ${email} not found in db`
                    }
                });
            }

            bcrypt.compare(password, rows.password, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            title: "bcrypt error",
                            detail: "Error while hashing password using bcrypt."
                        }
                    });
                }

                if (result) {
                    const secret = process.env.JWT_SECRET;
                    let payload = { email: email };
                    let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h'});

                    db.run(`UPDATE users SET token = ? WHERE email = ?;`, jwtToken, email, (err) => {
                        if (err) {
                            return res.status(500).json({
                                errors: {
                                    status: 500,
                                    title: "bcrypt error",
                                    detail: "Error while hashing password using bcrypt."
                                }
                            });
                        }
                    })
                    return res.json({
                        data: {
                            status: 200,
                            title: "Login successful",
                            detail: `User ${email} is now logged in.`,
                            user: {
                                "email": email,
                                "username": rows.username,
                                "balance": rows.balance,
                                "token": jwtToken
                            }
                        }
                    });
                }

                return res.status(401).json({
                    errors: {
                        status: 401,
                        title: "Incorrect password",
                        detail: "The password you entered was incorrect."
                    }
                });
            });
        });
    },


    register: async function(res, body) {
        const username = body.username;
        const email = body.email;
        const password = body.password;
        if (!username) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    title: "Username missing",
                    detail: "Username missing in request or is invalid"
                }
            });
        }

        if (!email || !validator.validate(email)) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    title: "Email missing",
                    detail: "Email missing in request or is invalid"
                }
            });
        }

        if (!password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    title: "Password missing",
                    detail: "Password missing in request"
                }
            });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: "bcrypt error",
                        detail: "Error while hashing password using bcrypt."
                    }
                });
            }

            const secret = process.env.JWT_SECRET;
            let payload = { email: email };
            let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h'});
            const sql = `INSERT INTO users (username, email, password, token) VALUES (?, ?, ?, ?);`;

            db.run(sql, username, email, hash, jwtToken, (err) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }
                // const secret = process.env.JWT_SECRET;
                // let payload = { email: email };
                // let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h'});

                return res.status(201).json({
                    data: {
                        status: 201,
                        title: "User successfully created",
                        detail: `User with email ${email} successfully created`,
                        user: {
                            "email": email,
                            "username": username,
                            "balance": 0,
                            "token": jwtToken
                        }
                    }
                });
            });
        });

    },

    deregister: function(res, body) {
        const email = body.email;
        const password = body.password;

        if (!email || !validator.validate(email)) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email missing",
                    detail: "Email missing in request or is invalid"
                }
            });
        }

        if (!password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Password missing",
                    detail: "Password missing in request"
                }
            });
        }

        const sql = `SELECT * FROM users WHERE email = ?;`;

        db.get(sql, email, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: "Database error",
                        detail: "Error while running SQL-command"
                    }
                });
            }

            if (rows === undefined) {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        title: "Failed to find user",
                        detail: `User with name ${email} not found in db`
                    }
                });
            }

            bcrypt.compare(password, rows.password, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            title: "bcrypt error",
                            detail: "Error while hashing password using bcrypt."
                        }
                    });
                }
                // return res.json(result);
                if (result) {
                    // return res.json({data: "data"})

                    // NÅNTING SOM INTE FUNKAR MED ATT SKICKA DETTA REQUEST
                    // Det sker men får error ändå
                    db.run("DELETE FROM users WHERE email = ?", email, (err) => {
                        if (err) {
                            return res.status(500).json({
                                errors: {
                                    status: 500,
                                    title: "Database error",
                                    detail: err.message
                                }
                            });
                        }

                        return res.status(200).json({ data: "Delete successful" })
                    });
                }

                return res.status(401).json({
                    errors: {
                        status: 401,
                        title: "Incorrect password",
                        detail: "The password you entered was incorrect."
                    }
                });
            });
        });
    },
}


module.exports = auth;
