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

var depNamesArray = ['Add a new Department?'];
var roleNamesArray = ['Add a new Role?'];


// //add Function Ptompt User
const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What whould you like to do?',
            choices: ['View all Departments','View all Roles','View all Employees','View department budget','Add Department','Add Role','Add Employee','Update an Employee Role','Update manager','Exit']
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
            case "Add Role":
                addNewRole();
                break;
            case "Add Employee":
                addNewEmployee();
                break;             
            case "Update an Employee Role":
                updateEmployee();
                break;             
            case "Update manager":
                updateManager();
                break;             
            case "View department budget":
                viewDepartmentBudget();
                break;             
            case "Exit":
                db.end();
                break;
        }
    })
};

//View all departments
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

//View all active roles
const viewAllRoles = () => {
    db.query(`SELECT roles.id AS role_id, roles.title,  departments.name AS department, 
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

//View all active Employees
const viewAllEmployees = () => {
    var sql = `SELECT employees.id, employees.first_name, employees.last_name,
                roles.title AS role, departments.name AS department, 
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

//Create a new department
const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'newDepartment',
            type: 'input',
            message: 'What Department would you like to add?'
        }
    ]).then((response) => {
        //if blank request a valid department
        if(response.newDepartment === ''){
            console.log(chalk.red(boxen("Please add a valid department name!")));
            return addDepartment();
        }
        const sql = `INSERT INTO departments (name) VALUES (?)`;
        db.query(sql,response.newDepartment, (err, row) => {
            if (err){
                console.log(err)
                return promptUser();
            }
            console.log(chalk.hex('#4682B4').bold(boxen(chalk.bold(response.newDepartment + ` department successfully created!`))));
            viewAllDepartments();
        });
    });
};


//Create New Role
const addNewRole = () => {
    depList();
    inquirer.prompt([
        {
            name: "newRole",
            type: "input",
            message: "What is the name of your new role?"
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of this new role?',
        },
        {
            name: 'departmentName',
            type: 'list',
            message: 'Which department is this new role in?',
            choices: depNamesArray
        }
    ]).then((response) => {
        if(response.departmentName == "Add a new Department?"){
            return addNewRole();
        }
        if(response.newRole == '' || response.salary == ''|| response.departmentName =='' ){
            console.log(chalk.red(boxen("Please add a valid Role name, Salary and Department!")));
            return addNewRole();
        }

        let depID = response.departmentName.split(".");
        let idnum = depID[0];
        const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
        const params = [response.newRole, response.salary,idnum];

        db.query(sql, params, (err, row) => {
            if (err){
                console.log(err)
                return promptUser();
            }
            console.log(chalk.hex('#4682B4').bold(boxen(chalk.bold(response.newRole + ` role successfully created!`))));
            viewAllRoles();
        });
    });
};

//create list of departments
const depList = ()=> {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, resp) => {
        if (err) {console.log(err)}
        resp.forEach((departments) => {
            depNamesArray.push(departments.id + "." + departments.name)     
        });
        return depNamesArray  
    })
};
//create list of roles
const roleList = ()=> {
    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, resp) => {
        if (err) {console.log(err)}
        resp.forEach((roles) => {
            roleNamesArray.push(roles.id + "." + roles.title)
        });
        return roleNamesArray  
    })
};

//Add an employee
const addNewEmployee = () => {
    roleList();
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?"
        },
        {
            name: 'lastName',
            type: 'input',
            message: "What is the employee's last name?",
        },
        {
            name: 'managerId',
            type: 'input',
            message: "Who is the employee's manager id?",
        },
        {
            name: 'role',
            type: 'list',
            message: "What is the employee's role?",
            choices: roleNamesArray
        },
    ]).then((response) => {
        if(response.role == "Add a new Role?"){
            return addNewRole();
        }
        if(response.firstName == '' || response.lastName == ''|| response.role ==''|| response.managerId == '' ){
            console.log(chalk.red(boxen("Please add a valid employee first name, last name, role and manager Id!")));
            return addNewEmployee();
        }
        let roleID = response.role.split(".");
        let idnum = roleID[0];
        const sql = `INSERT INTO employees (first_name, last_name, manager_id,role_id) VALUES (?,?,?,?)`;
        const params = [response.firstName, response.lastName,response.managerId, idnum];

        db.query(sql, params, (err, row) => {
            if (err){
                console.log(err)
                return promptUser();
            }
            console.log(chalk.hex('#4682B4').bold(boxen(chalk.bold(response.firstName + ` has been added!`))));
            viewAllEmployees();
        });
    });
};

var namesArray = ["Create a new Employee?"];
//create list of Employees
const empList = ()=> {
    const sql = `SELECT * FROM employees`;
    db.query(sql, (err, resp) => {
        if (err) {console.log(err)}
        resp.forEach((employees) => {
            namesArray.push(employees.id + "." + employees.first_name+" "+employees.last_name)     
        });
        //console.log(namesArray)
        return namesArray  
    })
};

//Update employee
const updateEmployee = () => {
    roleList();
    
    inquirer.prompt([
        {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee has a new role?',
            //choices: ["1","2","3","4","5","6","7","8","9","10","11","12","13","142","15","16","17","18","19","20","21","22"]
            choices: namesArray
        },
        {
            name: 'newRole',
            type: 'list',
            message: 'What is the new role?',
            choices: roleNamesArray
            //choices: roleNamesArray
        }
    ]).then((response) => {
        if(response.chosenEmployee == "Create a new Employee?"){
            return addNewEmployee();
        }else if(response.newRole == "Add a new Role?"){
            return addNewRole();
        }
        if(response.chosenEmployee == '' || response.newRole == ''){
            console.log(chalk.red(boxen("Please select a valid employee Name and Role!")));
            return updateEmployee();
        }
        let roleID = response.newRole.split(".");
        let roleidnum = roleID[0];
        let employeeID = response.chosenEmployee.split(".");
        let employeeidnum = employeeID[0];
        const sql = `UPDATE employees SET employees.role_id = ? WHERE employees.id = ?`;
        const params = [roleidnum, employeeidnum];
        db.query(sql,params, (err,row) => {
            if (err){
                console.log(err)
                return promptUser();
            }
            console.log(chalk.hex('#4682B4').bold(boxen(chalk.bold(response.chosenEmployee + ` role has been updated!`))));
            viewAllEmployees();
        })
    });
};

//Update employee
const updateManager = () => {    
    inquirer.prompt([
        {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee has a new Manager?',
            choices: namesArray
        },
        {
            name: 'newManager',
            type: 'list',
            message: 'Who is the new Manager?',
            choices: namesArray
        }
    ]).then((response) => {
        if(response.chosenEmployee == "Create a new Employee?" || response.newManager == "Create a new Employee?" ){
            return addNewEmployee();
        }
        if(response.chosenEmployee == '' || response.newManager == ''){
            console.log(chalk.red(boxen("Please select a valid employee Name and Role!")));
            return updateManager();
        }
        let managerID = response.newManager.split(".");
        let manageridnum = managerID[0];
        let employeeID = response.chosenEmployee.split(".");
        let employeeidnum = employeeID[0];
        const sql = `UPDATE employees SET employees.manager_id = ? WHERE employees.id = ?`;
        const params = [manageridnum, employeeidnum];
        db.query(sql,params, (err,row) => {
            if (err){
                console.log(err)
                return promptUser();
            }
            console.log(chalk.hex('#4682B4').bold(boxen(chalk.bold(response.chosenEmployee + ` manager has been updated!`))));
            viewAllEmployees();
        })
    });
};

//VIew Budget per department
const viewDepartmentBudget = () => {
   const sql =     `SELECT department_id AS id, 
                    departments.name AS department,
                    SUM(salary) AS budget
                    FROM  roles  
                    INNER JOIN departments ON roles.department_id = departments.id GROUP BY  roles.department_id`;
    db.query(sql, (error, row) => {
        if (error){
            console.log(err);
        } 
        console.log(chalk.hex('#4682B4').bold(`→ Total Departments:`));
        console.table(row);
        promptUser();
    });
  };

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected as ID ' +db.threadId);
    console.log(chalk.hex('#87CEEB').bold(boxen(chalk.hex('#4682B4').bold(figlet.textSync(`
    Employee Tracker`)+chalk.white(`
                                                                    Created by @Leman102`)), 
    {borderStyle: 'double',titleAlignment: 'center'})));
    empList();
    promptUser();
});
