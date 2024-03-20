
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};


async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to the database!');
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
}

// Create a function to view all departments
async function viewAllDepartments(connection) {
    try {
        const [rows] = await connection.query('SELECT * FROM departments');
        console.table(rows);
    } catch (error) {
        console.error('Error fetching departments:', error);
    }
}

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
            LEFT JOIN roles ON employees.role_id = roles.id
            LEFT JOIN departments ON roles.department_id = departments.id
            LEFT JOIN employees AS managers ON employees.manager_id = managers.id
        `);
        console.table(rows);
    } catch (error) {
        console.error('Error fetching roles:', error);
    }
}

// Create function to view all employees
async function viewAllEmployees(connection) {
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
            LEFT JOIN roles ON employees.role_id = roles.id
            LEFT JOIN departments ON roles.department_id = departments.id
            LEFT JOIN employees AS managers ON employees.manager_id = managers.id
        `);
        console.table(rows);
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

// Function to add a department

// Function to add department
async function addDepartment(connection) {
    const { name } = await inquirer.prompt({
        name: 'name',
        message: 'Enter the name of the department:'
    });
    try {
        await connection.query('INSERT INTO departments (name) VALUES (?)', [name]);
        console.log('Department added successfully!');
    } catch (error) {
        console.error('Error adding department:', error);
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
                message: 'Enter the title of the role:'
            },
            {
                name: 'salary',
                message: 'Enter the salary for this role:'
            },
            {
                name: 'departmentId',
                type: 'list',
                message: 'Select the department for this role:',
                choices: departments.map(department => ({
                    name: department.name,
                    value: department.id
                }))
            }
        ]);

        await connection.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
        console.log('Role added successfully!');
    } catch (error) {
        console.error('Error adding role:', error);
    }
}

// add employee functio
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

// Function to update an employee role
async function updateEmployeeRole(connection) {
    try {
        const [employees] = await connection.query('SELECT id, first_name, last_name FROM employees');

        const employeeChoices = employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }));

        const { employeeId, roleId } = await inquirer.prompt([
            {
                name: 'employeeId',
                type: 'list',
                message: 'Select an employee to update:',
                choices: employeeChoices
            },
            {
                name: 'roleId',
                type: 'input',
                message: 'Enter the ID of the new role for this employee:'
            }
        ]);

        await connection.query('UPDATE employees SET role_id = ? WHERE id = ?', [roleId, employeeId]);
        console.log('Employee role updated successfully!');
    } catch (error) {
        console.error('Error updating employee role:', error);
    }
}

// Main function
// main function
async function main() {
    const connection = await connectToDatabase();

    while (true){
        const {choice } = await inquirer.prompt({
            name:'choice',
            type:'list',
            message:'What would you like to do?',
            choices: [
                'View all Departments',
                'View all Roles',
                'View all Employees',
                'Add Department',
                'Add Employee',
                'Update Employee Role',
                'View all Departments', // This line should be 'View all Roles' instead of 'View all Departments'
                'Quit'
            ]
        });
        switch(choice){
            case'View all Departments':
            await viewAllDepartments(connection);
            break;
            case'View all Roles':
            await viewAllRoles(connection);
            break;
            case'View all Employees':
            await viewAllEmployees(connection);
            break;
            case'Add Department':
            await addDepartment(connection);
            break;
            case'Add Role':
            await addRole(connection);
            break;
            case'Add Employee':
            await addEmployee(connection);
            break;
            case'Update Employee Role':
            await updateEmployeeRole(connection);
            break;
            case'Quit':
            console.log('Exiting...');
            process.exit(0);
            break;
        }
    }
}

