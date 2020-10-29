$(> db/market.sqlite)
cat db/migrate.sql | sqlite3 db/market.sqlite
cat db/seed.sql | sqlite3 db/market.sqlite
