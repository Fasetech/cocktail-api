const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "cocktail-api",
    password: "",
});

connection.connect();
module.exports = connection;