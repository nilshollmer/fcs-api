const db = require('../db/database.js');

const market = {
    fetchAllProducts: function(req, res) {
        const sql = 'SELECT * FROM market;';

        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: "Database error (fetchAllProducts)",
                        detail: err.message
                    }
                });
            }

            return res.status(200).json({ data: rows })
        })
    },

    fetchProduct: function(req, res) {
        const product = req.params.product;
        const sql = 'SELECT * FROM market WHERE product = ?;';
        db.get(sql, product, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: "Database error (fetchProduct)",
                        detail: err.message
                    }
                });
            }

            return res.status(200).json({ data: rows })
        })
    },

    updateProductValue: function(req, res) {
        const product = req.body.product;
        const value = req.body.sell_value;
        const sql = 'UPDATE market SET sell_value = ? WHERE product = ?;';

        db.run(sql, value, product, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: "Database error(updateProductValue)",
                        detail: err.message
                    }
                });
            }
            return res.status(204).json({
                data: {
                    status: 204,
                    title: "Update successful",
                    product: product,
                    value: value
                }
            });
        })
    },
    fetchMarketHistory: function(req, res) {
        const sql = 'SELECT rowid, * FROM market_history;';

        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: "Database error (fetchMarketHistory)",
                        detail: err.message
                    }
                });
            }

            return res.status(200).json({ data: rows });
        })
    },
    fetchMarketHistoryByEntries: function(req, res) {
        const numOfEntries = req.params.entries;
        const sql = 'SELECT * FROM (SELECT rowid, * FROM market_history ORDER BY rowid DESC LIMIT ?) ORDER BY rowid ASC;';

        db.all(sql, numOfEntries, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: "Database error (fetchMarketHistoryByEntries)",
                        detail: err.message
                    }
                });
            }

            return res.status(200).json({ data: rows });
        })
    },
    writeMarketHistory: function(req, res) {
        // Date and time formatting
        // YYYY-MM-DD
        // hh:mm:ss
        const values = Object.values(req.body);

        const sql = 'INSERT INTO market_history (dateof, timeof, bells, pokedollar, rupees, rings) VALUES (?, ?, ? ,? , ?, ?);';

        db.run(sql, values, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: "Database error (writeMarketHistory)",
                        detail: err.message
                    }
                });
            }

            return res.status(201).json({
                data: {
                    status: 201,
                    title: "Market History Written Successfully"
                }
            });
        })
    }
}

module.exports = market;
