const mysql = require('mysql2');

//connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //your MySQL ussername,
        user: 'root',
        //your MySQL password
        password: 'leman5366',
        database: 'employee_tracker'
    },
    console.log('Connected to the employee_tracker database')
);

module.exports = db;