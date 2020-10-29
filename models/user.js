const db = require('../db/database.js');

const user = {
    fetchAllUsers: function(req, res) {
        const sql = "SELECT username, email FROM users;";
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            return res.status(200).json( { data: rows } );
        });
    },

    fetchUser: function(username, res) {
        const user = username;
        const sql = "SELECT username, email, balance, token FROM users WHERE username = ?;";
        db.get(sql, user, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            return res.status(200).json( { data: rows } );
        });
    },

    fetchBalance: function(req, res) {
        const user = req.params.user;
        const sql = "SELECT balance FROM users WHERE username = ?;";

        db.get(sql, user, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: 'Database error (fetchBalance)',
                        detail: err.message
                    }
                });
            }

            return res.status(200).json({ data: rows });
        });
    },

    fetchStock: function(req, res) {
        const user = req.params.user;
        const sql = "SELECT rowid, * FROM user_stock WHERE user = ?;";

        db.all(sql, user, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: 'Database error (fetchStock)',
                        detail: err.message
                    }
                });
            }

            return res.status(200).json({ data: rows });
        });
    },

    fetchStockDetail: function(user, product, res) {
        const sql = "SELECT * FROM user_stock WHERE user = ? AND product = ?;";

        db.all(sql, user, product, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: 'Database error (fetchStockDetail)',
                        detail: err.message
                    }
                });
            }

            return res.status(200).json({
                data: rows
            });
        });
    },

    updateBalance: function(req, res) {
        const user = req.params.user;
        // const user = req.body.user;
        const balance = req.body.balance;
        const sql = 'UPDATE users SET balance = ? WHERE username = ?;';

        db.run(sql, balance, user, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: "Database error (updateBalance)",
                        detail: err.message
                    }
                });
            }

            return res.status(204).json({ data: rows })
        })
    },

    addProductToUserStock: function(req, res) {
        const user = req.body.user;
        const product = req.body.product;


        const sql = "INSERT INTO user_stock (user, product) VALUES (?, ?);";

        db.run(sql, user, product, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: "Database error (addProductsToUserStock)",
                        detail: err.message
                    }
                });
            }

            return res.status(201).json({
                data: {
                    status: 201,
                    title: "User stock updated",
                }
            });
        })
    },

    removeProductFromUserStock: function(req, res) {
        const user = req.params.user;
        const product = req.body.product;
        const id = req.body.id;

        const sql = "DELETE FROM user_stock WHERE rowid = ?;";
        // const sql = "DELETE FROM user_stock WHERE user = ? AND product = ? LIMIT 1;";
        db.run(sql, id, (err, rows) => {
        // db.run(sql, user, product, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: "Database error (RemoveProductsFromUserStock)",
                        detail: err.message
                    }
                });
            }

            return res.status(201).json({
                data: {
                    status: 201,
                    title: "User stock updated",
                }
            });
        });
    }
}
module.exports = user;
