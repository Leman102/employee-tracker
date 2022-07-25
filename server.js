//Dependencies
const express = require('express');
const inquirer = require("inquirer");
const chalk = require ("chalk");
const figlet = require("figlet");
const boxen = require ("boxen");

//Connect to my database const mysql = require('mysql2');
const db = require('./db/connection');

const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//add Function Ptompt User
const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What whould you like to do?',
            choices: ['View all Roles','View all Employees', 
                        'Add a Department','Add a Role','Add an Employee',
                        'Update an Employee Role','Exit']
        }
    ]).then(val => {
        switch (val.choice) {
            case "View all Roles":
                viewAllRoles()
                break;
            case "Exit":
                db.end();
                break;
        }
    })
};

function viewAllRoles() {
    db.query("SELECT * FROM employees", (err, rows) => {
    if (err) throw err;
    console.table(rows);
    
    })
};

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected as ID ' +db.threadId);
    // console.log(boxen(chalk.bold.blue(figlet.textSync(`
    // Employee Tracker`)), {padding: 1, margin: 1, borderStyle: 'double'}));
    console.log(chalk.hex('#87CEEB').bold(boxen(chalk.hex('#4682B4').bold(figlet.textSync(`
    Employee Tracker`)+chalk.white(`
                                                                    Created by @Leman102`)), 
    {borderStyle: 'double',titleAlignment: 'center'})));
    promptUser();
});
