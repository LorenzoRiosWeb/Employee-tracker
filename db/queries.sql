-- View all departments
SELECT * FROM departments;

-- View all roles
SELECT roles.id, roles.title, roles.salary, departments.name AS department
FROM roles
INNER JOIN departments ON roles.department_id = departments.id;

-- View all employees
SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role, 
departments.name AS department, roles.salary, CONCAT(managers.first_name, ' ', managers.last_name) AS manager
FROM employees
LEFT JOIN roles ON employees.role_id = roles.id
LEFT JOIN departments ON roles.department_id = departments.id
LEFT JOIN employees AS managers ON employees.manager_id = managers.id;

-- add a department
INSERT INTO departments (name) VALUES ('New Department');

-- Add a new Role
INSERT INTO roles (title,salary,deparment_id) VALUEs ('New,Role', 50000, 1);

-- Add a Employee

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES('John', 'Doe', 1, NULL)

-- Update an employee role

UPDATE employees SET role_id = 2 WHERE id = 1;

