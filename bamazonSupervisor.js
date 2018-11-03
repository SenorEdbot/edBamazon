const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "edbot",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

const start = () => {
    inquirer.prompt([
        {
            name: "supervisorAction",
            type: "list",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"],
            message: "Aye, yo, Supervisor. What would you like to do?"
        }
    ]).then(answer => {
        switch (answer.userAction) {
            case "View Product Sales by Department":
                productSales();
                // start();       
                break;
            case "Create New Department":
                createNewDept();
                // start();
                break;
            case "Exit":
                console.log("Thanks, CYA LATER");
                connection.end();
                break;
            default:
                console.log("Please check your input");
                connection.end();
                break;
        }
    })
}

const productSales = () => {
    console.log("In the product sales.");
}

const createNewDept = () => {
    console.log("Create New Department");
}