# API for Fantasy Currency Service
Database for FCS.

Jag valde att skriva min server i Express eftersom jag känner mig bekväm med syntaxen och filstrukturen.
Till min databas valde jag SQlite av samma anledning, jag känner mig bekväm med relationsdatabaser och
tyckte att det passade för det här projektet.  
Databasen består av fyra tabeller som innehåller användare, produkter, användares produkter och prishistorik.

Jag använder Bcrypt för kryptering av lösenord och jsonwebtokens för autensiering i servern.


## Install
Run `npm install` to install dependencies.

## Usage
Run `npm start`

## Routes
"GET /": "This route, available routes"  
"GET /user": "Get all users"  
"GET /user/:user": "Get user details"  
"GET /user/:user/balance": "Get user balance"  
"GET /user/:user/stock": "Get user stock"  
"GET /user/:user/stock/:product": "Get user stock of a specific product"  

"PUT /user/:user/balance": "Update user balance"  
"POST /user/:user/stock": "Add or remove user stock"  

"GET /market" : "Get all products"  
"GET /market/:product": "Get product details"  
"GET /market/:product/value": "Get value of stock"  
"GET /market/value": "Get value of stock"  

"PUT /market/value": "Update value of stock"  

"POST /auth/register": "Register a new user"  
"POST /auth/login": "Login and receive a JWT-token.  
