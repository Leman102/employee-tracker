const mysql = require('mysql2');

//connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //your MySQL ussername,
        user: 'root',
        //your MySQL password
        password: 'password',
        database: 'employeeTracker'
    },
    console.log('Connected to the employeeTracker database')
);

module.exports = db;
