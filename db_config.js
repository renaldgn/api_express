var mysql = require('mysql');

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port: '3306'
    // host: "localhost",
    // user: "root",
    // password: "",
    // port: '3306'
});

module.exports = db;