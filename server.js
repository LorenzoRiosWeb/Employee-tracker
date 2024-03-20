const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        console.log('error connecting to the database:', error);
        process.env(1);
    }
}

// Create a function to view all departments
async function viewAllDepartments(connection) {}

// Create a function to view all roles
async function viewAllRoles(connection) {}


// Create function to view all employees

async function viewAllEmployees(connection) {}

// Function to add department

async function addDepartment(connection){

}

// Create function to add role

async function addRole(connection){

}

// add employee function

async function addEmployee(connection) {}

// function to update the employee role

async function updateEmployeeRole(connection) {}

// main function

async function main() {}
