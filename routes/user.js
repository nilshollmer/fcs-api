const router = require('express').Router();

const auth = require('../models/auth.js');
const user = require('../models/user.js');
const market = require('../models/market.js');

router.get('/',
    (req, res) => user.fetchAllUsers(req, res)
);

router.get('/:user',
    (req, res) => user.fetchUser(req.params.user, res)
);

router.get('/:user/balance/',
    (req, res) => user.fetchBalance(req, res)
);

router.get('/:user/stock/',
    (req, res) => user.fetchStock(req, res)
);

router.get('/:user/stock/:product',
    (req, res) => user.fetchStockDetail(req.params.user, req.params.product, res)
);

router.put('/:user/balance',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => user.updateBalance(req, res)
);

router.post('/stock/buy',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => user.addProductToUserStock(req, res)
);

router.post('/stock/sell',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => user.removeProductFromUserStock(req, res)
);
module.exports = router;
