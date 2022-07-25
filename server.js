//Dependencies
const express = require('express');
const inquirer = require("inquirer");
const chalk = require ("chalk");
const figlet = require("figlet");
const boxen = require ("boxen");

//Connect to my database const mysql = require('mysql2');
const db = require('./db/connection');
const { text } = require('figlet');

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
            choices: ['View all Departments','View all Roles','View all Employees', 
                        'Add Department','Add Role','Add Employee',
                        'Update an Employee Role','Exit']
        }
    ]).then(val => {
        switch (val.choice) {
            case "View all Departments":
                viewAllDepartments();
                break;
            case "View all Roles":
                viewAllRoles();
                break;
            case "View all Employees":
                viewAllEmployees();
                break;             
            case "Add Department":
                addDepartment();
                break;             
            case "Exit":
                db.end();
                break;
        }
    })
};


const viewAllDepartments = () => {
    db.query(`SELECT name AS department_name, id AS departament_id 
    FROM departments`, (err, rows) => {
    if (err){
        console.log(err)
    }
    console.log(chalk.hex('#4682B4').bold(`→ Total Departments:`));
    console.table(rows);
    promptUser();
    });
};

const viewAllRoles = () => {
    db.query(`SELECT roles.title, roles.id, departments.name AS department, 
    roles.salary FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id`, (err, rows) => {
    if (err){
        console.log(err)
    }
    console.log(chalk.hex('#4682B4').bold(`→ Total Roles:`));
    console.table(rows);
    promptUser();
    });
};

const viewAllEmployees = () => {
    var sql = `SELECT employees.id, employees.first_name, employees.last_name,
                roles.title, departments.name AS department, 
                roles.salary, employees.manager_id FROM employees
                LEFT JOIN roles ON employees.role_id = roles.id
                LEFT JOIN departments ON roles.department_id = departments.id`;
    db.query(sql, (err, rows) => {
        if (err){
            console.log(err)
         }
        console.log(chalk.hex('#4682B4').bold(`→ Current Employees:`));
        console.table(rows);
        promptUser();
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'newDepartment',
            type: 'input',
            message: 'What Department would you like to add?'
        }
    ]).then((response) => {
        const sql = `INSERT INTO departments (name) VALUES (?)`;
        db.query(sql,response.newDepartment, (err, row) => {
            if (err){
                console.log(err)
            }
            console.log(chalk.hex('#4682B4').bold(boxen(chalk.bold(response.newDepartment + ` department successfully created!`))));
            promptUser();
        });
    });
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
