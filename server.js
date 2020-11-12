 //Dependancies 
var mysql = require("mysql");
var inquirer = require("inquirer");


// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Volcom28!",
    database: "employee_trackerDB"
});




// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update employee role",
          "Exit"
        ]
      })
    .then(function(answer) {
        if (answer.action === 'View all departments') {
            viewDepartments();
        } else if (answer.action === 'View all roles') {
            viewRoles();
        } else if (answer.action === 'View all employees') {
            viewEmployees();
        } else if (answer.action === 'Add a department') {
            addDepartment();
        } else if (answer.action === 'Add a role') {
            addRole();
        } else if (answer.action === 'Add an employee') {
            addEmployee();
        } else if (answer.action === 'Update employee role') {
            updateRole();
        }
        else if (answer.action === 'Exit') {
            connection.end();
        }
    })
}

//view dep, emp, role
function viewDepartments() {
    var query = "SELECT * FROM department";
      connection.query(query, function(err, res) {
          console.log(`DEPARTMENTS:`)
        res.forEach(department => {
            console.log(`ID: ${department.id} | Name: ${department.name}`)
        })
        start();
        });
    };

function viewRoles() {
    var query = "SELECT * FROM role";
        connection.query(query, function(err, res) {
            console.log(`ROLES:`)
        res.forEach(role => {
            console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary} | Department ID: ${role.department_id}`);
        })
        start();
        });
    };

function viewEmployees() {
    var query = "SELECT * FROM employee";
        connection.query(query, function(err, res) {
            console.log(`EMPLOYEES:`)
        res.forEach(employee => {
            console.log(`ID: ${employee.id} | Name: ${employee.first_name} ${employee.last_name} | Role ID: ${employee.role_id} | Manager ID: ${employee.manager_id}`);
        })
        start();
        });
    };

    //Add dep, emp, role

    function addDepartment() {
        inquirer
            .prompt({
                name: "department",
                type: "input",
                message: "What is the name of the new department?",
              })
            .then(function(answer) {
            var query = "INSERT INTO department (name) VALUES ( ? )";
            connection.query(query, answer.department, function(err, res) {
                console.log(`You have added this department: ${(answer.department).toUpperCase()}.`)
            })
            viewDepartments();
            })
    }
    
    function addRole() {
        connection.query('SELECT * FROM department', function(err, res) {
            if (err) throw (err);
        inquirer
            .prompt([{
                name: "title",
                type: "input",
                message: "What is the title of the new role?",
              },
              {
                name: "departmentName",
                type: "list",
    // is there a way to make the options here the results of a query that selects all departments?`
                message: "Which department does this role fall under?",
                choices: function() {
                    var choicesArray = [];
                    res.forEach(res => {
                        choicesArray.push(
                            res.name
                        );
                    })
                    return choicesArray;
                  }
              }
              ]) 
    // Filtering through department to get ID
            .then(function(answer) {
            const department = answer.departmentName;
            connection.query('SELECT * FROM DEPARTMENT', function(err, res) {
            
                if (err) throw (err);
             let filteredDept = res.filter(function(res) {
                return res.name == department;
            }
            )
            let id = filteredDept[0].id;
           let query = "INSERT INTO role (title, department_id) VALUES (?, ?)";
           let values = [answer.title, parseInt(answer.salary), id]
           console.log(values);
            connection.query(query, values,
                function(err, res, fields) {
                console.log(`You have added this role: ${(values[0]).toUpperCase()}.`)
            })
                viewRoles()
                })
            })
        })
    }
    
    //Adding an employer and pushing the employers role to the roles array
    async function addEmployee() {
        connection.query('SELECT * FROM role', function(err, result) {
            if (err) throw (err);
        inquirer
            .prompt([{
                name: "firstName",
                type: "input",
                message: "What is the employee's first name?",
              }, 
              {
                name: "lastName",
                type: "input",
                message: "What is the employee's last name?",
              },
              {
                name: "roleName",
                type: "list",
                message: "What role does the employee have?",
                choices: function() {
                 rolesArray = [];
                    result.forEach(result => {
                        rolesArray.push(
                            result.title
                        );
                    })
                    return rolesArray;
                  }
              }
              ]) 
            .then(function(answer) {
            console.log(answer);
            const role = answer.roleName;
            connection.query('SELECT * FROM role', function(err, res) {
                if (err) throw (err);
                let filteredRole = res.filter(function(res) {
                    return res.title == role;
                })
            let roleId = filteredRole[0].id;
            connection.query("SELECT * FROM employee", function(err, res) {
                    inquirer
                    .prompt ([
                        {
                            name: "manager",
                            type: "list",
                            message: "Who is your manager?",
                            choices: function() {
                                managersArray = []
                                res.forEach(res => {
                                    managersArray.push(
                                        res.last_name)
                                    
                                })
                                return managersArray;
                            }
                        }
                    ]).then(function(managerAnswer) {
                        const manager = managerAnswer.manager;
                    connection.query('SELECT * FROM employee', function(err, res) {
                    if (err) throw (err);
                    let filteredManager = res.filter(function(res) {
                    return res.last_name == manager;
                })
                let managerId = filteredManager[0].id;
                        console.log(managerAnswer);
                        let query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                        let values = [answer.firstName, answer.lastName, roleId, managerId]
                        console.log(values);
                         connection.query(query, values,
                             function(err, res, fields) {
                             console.log(`You have added this employee: ${(values[0]).toUpperCase()}.`)
                            })
                            viewEmployees();
                            })
                         })
                    })
                })
            })
    })
    }
    