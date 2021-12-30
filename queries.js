const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "cocktail-api",
    password: "root",
    port: 5432,
});