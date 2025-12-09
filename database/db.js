const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "blog.sql"
});

connection.connect((err) => {
    if (err) throw err.message
    console.log('DB Connection successful!');
})
module.exports = connection;