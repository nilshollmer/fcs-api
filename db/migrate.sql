DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS market;
DROP TABLE IF EXISTS user_stock;
DROP TABLE IF EXISTS currencyvaluehistory;

CREATE TABLE users (
    username        VARCHAR(60) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    password        VARCHAR(60) NOT NULL,
    token           VARCHAR(255),
    balance         INTEGER,

    UNIQUE(username, email)
);

CREATE TABLE market (
    product         VARCHAR(255) NOT NULL,
    sell_value      FLOAT,

    UNIQUE(product)
);

CREATE TABLE  user_stock (
    user            VARCHAR(60) NOT NULL,
    product         VARCHAR(255) NOT NULL,

    FOREIGN KEY(user) REFERENCES users(username),
    FOREIGN KEY(product) REFERENCES market(product)
);

CREATE TABLE market_history (
    dateof          DATE NOT NULL,
    timeof          TIME NOT NULL,
    bells           FLOAT,
    rings           FLOAT,
    pokedollar      FLOAT,
    rupees          FLOAT
);
