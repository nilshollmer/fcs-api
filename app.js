const app           = require('express')();
const cors          = require('cors');
const morgan        = require('morgan');
const bodyParser    = require('body-parser');

// Routes
const auth          = require('./routes/auth.js')
const market        = require('./routes/market.js')
const user          = require('./routes/user.js')

const port = 3666;

app.use(cors());

// Hide log while testing
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log on command line
    app.use(morgan('combined')); // 'combined' outputs Apache style logs
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

app.get('/',(req, res, next) => {
    const data = {
        "GET /": "This route, available routes",
        "GET /user": "Get all users",
        "GET /user/:user": "Get user details",
        "GET /user/:user/balance": "Get user balance",
        "GET /user/:user/stock": "Get user stock",
        "GET /user/:user/stock/:product": "Get user stock of a specific product",

        "PUT /user/:user/balance": "Update user balance",
        "POST /user/:user/stock": "Add or remove user stock",

        "GET /market" : "Get all products",
        "GET /market/:product": "Get product details",
        "GET /market/:product/value": "Get value of stock",
        "GET /market/value": "Get value of stock",

        "PUT /market/value": "Update value of stock",

        "POST /auth/register": "Register a new user",
        "POST /auth/deregister": "Deregister a current user",
        "POST /auth/login": "Login and receive a JWT-token."
    };

    res.json(data);
})

app.use("/user", user);
app.use("/market", market);
app.use("/auth", auth);

app.use((req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title": err.message,
                "detail": err.message
            }
        ]
    });
});

const server = app.listen(port, () => console.log(`Auth-API listening to port ${port}.`))

module.exports = server;
