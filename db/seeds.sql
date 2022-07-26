-- Department seeds--
INSERT INTO departments (name)
VALUE ("Engineering"), ("Finance"),("Legal"),("Sales");

-- Role seeds--
INSERT INTO roles (title, salary, department_id)
VALUE ("Sales Lead", 150000, 4),
("Salesperson", 100000, 4),
("Developer", 175000, 1),
("Finance Lead", 160000, 2),
("CEO", 250000, 1),
("Lawyer", 150000, 3);

-- Employee seeds--
INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUE ("Leo", "Man", 14, 3),
("Jon", "Doe", 1, 2),
("Ex", "Blue", 3, 1),
("Peter", "Parker", 1, 1),
("Mary", "Watson", 2, 3),
("Gwen", "Stacy", 3, 6),
("Clark", "Kent", 1, 4),
("Loise", "Lane", 1, 1),
("Bruce", "Banner", 6, 2),
("Obi", "Kenobi", 14, 4),
("Tony", "Stark", 10, 3),
("Wanda", "Max", 10, 1),
("Steven", "Strange", 2, 3),
("Bruce", "Wayne", null, 5);