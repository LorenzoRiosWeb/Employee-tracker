-- Insert departments
INSERT INTO departments (name) VALUES
    ('Engineering'),
    ('Sales'),
    ('Finance');

-- Insert roles
INSERT INTO roles (title, salary, department_id) VALUES
    ('Software Engineer', 80000, 1),
    ('Sales Representative', 60000, 2),
    ('Financial Analyst', 70000, 3);

-- Insert employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, 1),
    ('David', 'Johnson', 3, 1);
