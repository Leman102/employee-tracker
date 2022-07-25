-- Department seeds--
INSERT INTO departments (name)
VALUE ("Sales");

-- Role seeds--
INSERT INTO roles (title, salary, department_id)
VALUE ("Sales Lead", 150000, 1);

-- Employee seeds--
INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUE ("Leo", "Man", null, 1);