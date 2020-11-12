
USE employee_db;

INSERT INTO department (name) VALUES ("Human Resources");
INSERT INTO department (name) VALUES ("Marketing");
INSERT INTO department (name) VALUES ("Information Technology");
INSERT INTO department (name) VALUES ("Corporate");

INSERT INTO role (title, department_id) VALUES ("Analyst", 3);
INSERT INTO role (title, department_id) VALUES ("Communications Associate", 2);
INSERT INTO role (title, department_id) VALUES ("Social Media Manager", 2);
INSERT INTO role (title, department_id) VALUES ("Director", 1);
INSERT INTO role (title, department_id) VALUES ("Director", 4);

INSERT INTO employee (first_name, last_name, role_id) VALUES ("David", "Jester", 2);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Abby", "Whiteman", 1);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Katie", "Pieto", 3);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Rachael", "Squirm", 4);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Lizzie", "Halep", 5);