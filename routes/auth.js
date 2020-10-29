const router = require('express').Router();
const auth = require('../models/auth.js');


router.post('/register', (req, res) => auth.register(res, req.body));

// Fixa denna route
// router.post('/deregister', (req, res) => auth.deregister(res, req.body));

router.post('/login', (req, res) => auth.login(res, req.body));

module.exports = router;
