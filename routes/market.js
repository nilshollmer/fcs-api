const router = require('express').Router();
const market = require('../models/market.js');

router.get('/',
    (req, res) => market.fetchAllProducts(req, res)
);


router.get('/product/:product',
    (req, res) => market.fetchProduct(req, res)
);

router.get('/history',
    (req, res) => market.fetchMarketHistory(req, res)
);

router.get('/history/:entries',
    (req, res) => market.fetchMarketHistoryByEntries(req, res)
);

router.post('/history',
    (req, res) => market.writeMarketHistory(req, res)
);

router.put('/product',
    (req, res) => market.updateProductValue(req, res)
);

module.exports = router;
