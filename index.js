
const inquirer = import('inquirer');
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
};

// Create a function to view all departments
async function viewAllDepartments(connection) {
    try{
        const [rows] =await connection.query('SELECT * FROM departments');
        console.table(rows);
    }catch (error) {
        console.error('Error fetching departments:', error);
    }
};

// Create a function to view all roles
async function viewAllRoles(connection) {
    try {
        const [rows] = await connection.query(`
            SELECT             
                employees.id, 
            
                employees.first_name, 
                
                employees.last_name, 
                
                roles.title AS role, 
                
                departments.name AS department, 
                
                roles.salary, 

                CONCAT(managers.first_name, ' ', managers.last_name) AS manager
            FROM employees
            LEFT JOIN            
               roles ON employees.role_id = roles.id
            LEFT JOIN            
                departments ON roles.department_id = departments.id               
            LEFT JOIN 
                employees AS managers ON employees.manager_id = managers.id
        `);
        console.table(rows);
    } catch (error) {
        console.error('Error fetching roles:', error);
    }
};


// Create function to view all employees

async function viewAllEmployees(connection) {
    try{
        const [rows] = await connection.query(`
        SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role, 

        departments.name AS department, roles.salary, CONCAT(managers.first_name, ' ', managers.last_name) AS manager

        FROM employees

        LEFT JOIN roles ON employees.role_id = roles.id

        LEFT JOIN departments ON roles.department_id = departments.id

        LEFT JOIN employees AS managers ON employees.manager_id = managers.id
    `); 
    console.table(rows);
    }catch (error){
        console.error('Error fetching employees: ', error);
    };
};

// Function to add department

// Function to add department
async function addDepartment(connection) {
    const { name } = await inquirer.prompt({
        name: 'name',
        message: 'Enter the name of the department'
    });
    try {
        await connection.query('INSERT INTO departments (name) VALUES (?)', [name]);
        console.log('Department added successfully');
    } catch (error) {
        console.error('Error adding department', error);
    }
}

// Create function to add role
async function addRole(connection) {
      // Fetches existing departments to display choices
    try {
        const [departments] = await connection.query('SELECT id, name FROM departments');
        
        const { title, salary, departmentId } = await inquirer.prompt([
            {
                name: 'title',
                message: 'Enter the title of the role: '
            },
            {
                name: 'salary',
                message: 'Enter the salary of the role: '
            },
            {
                name: 'departmentId',
                type: 'list',
                message: 'Select the department for this role: ',
                choices: departments.map(department => ({
                    name: department.name,
                    value: department.id
                }))
            }
        ]);

        await connection.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
        console.log('Role added successfully!');
    } catch (error) {
        console.error('Error adding role: ', error);
    }
}
// add employee function

async function addEmployee(connection) {
    try {
        const [roles] = await connection.query('SELECT id, title FROM roles');

        const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
            {
                name: 'firstName',
                message: 'Enter the first name of the employee:'
            },
            {
                name: 'lastName',
                message: 'Enter the last name of the employee:'
            },
            {
                name: 'roleId',
                type: 'list',
                message: 'Select the role for this employee:',
                choices: roles.map(role => ({
                    name: role.title,
                    value: role.id
                }))
            },
            {
                name: 'managerId',
                message: 'Enter the ID of the manager for this employee (leave blank if none):'
            }
        ]);

        await connection.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId || null]);
        console.log('Employee added successfully!');
    } catch (error) {
        console.error('Error adding employee:', error);
    }
}
    


// function to update the employee role
async function updateEmployeeRole(connection) {}

// main function

async function main() {}
