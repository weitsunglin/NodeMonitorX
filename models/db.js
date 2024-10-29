// models/db.js
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "yourUsername",
  password: "yourPassword",
  database: "yourDatabase"
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

module.exports = connection;
