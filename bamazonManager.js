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

let numChoicesArr = [];
connection.connect(function(err) {
  if (err) throw err;
  start();
});

const start = () => {
    inquirer.prompt([
        {
            name: "userAction",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            message: "Aye, yo, Manager. What would you like to do?"
        }
    ]).then(answer => {
        switch (answer.userAction) {
            case "View Products for Sale":
                displayProduct();
                start();
                break;
            case "View Low Inventory":
                displayLowInventory();
                start();
                break;
            case "Add to Inventory":
                displayProduct();
                addInventory();
                break;
            case "Add New Product":
                console.log("add new product");
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

const displayProduct = () => {
    connection.query("SELECT * FROM products", (err, results) => {
        if (err) throw err;
        let productsTable = new Table({
            head: ["ITEM_ID", "PRODUCT_NAME", "DEPARTMENT_NAME", "PRICE", "STOCK_QUANTITY"]
        })
        numChoicesArr = [];
        for (let i = 0; i < results.length; i++) {
            productsTable.push([
                results[i].item_id.toString()
                , results[i].product_name.toString()
                , results[i].department_name.toString()
                , "$" + results[i].price.toString()
                , results[i].stock_quantity.toString()
            ])
            numChoicesArr.push(results[i].item_id.toString());
        }
        console.log(`
----------------------------------------------------------
${productsTable.toString()}
----------------------------------------------------------
`)
    })
}

const displayLowInventory = () => {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", (err, results) => {
        if (err) throw err;
        let productsTable = new Table({
            head: ["ITEM_ID", "PRODUCT_NAME", "DEPARTMENT_NAME", "PRICE", "STOCK_QUANTITY"]
        })
        for (let i = 0; i < results.length; i++) {
            productsTable.push([
                results[i].item_id.toString()
                , results[i].product_name.toString()
                , results[i].department_name.toString()
                , "$" + results[i].price.toString()
                , results[i].stock_quantity.toString()
            ])
        }
        console.log(`
----------------------------------------------------------
${productsTable.toString()}
----------------------------------------------------------
`)
    })
}

const addInventory = () => {
    connection.query("SELECT * FROM products", (err, results) =>{
        if (err) throw err;
        let productsTable = new Table({
            head: ["ITEM_ID", "PRODUCT_NAME", "DEPARTMENT_NAME", "PRICE", "STOCK_QUANTITY"]
        })
        let numChoicesArr = [];
        for (let i=0; i< results.length; i++) {
            productsTable.push([
                results[i].item_id.toString()
                , results[i].product_name.toString()
                , results[i].department_name.toString()
                , "$"+results[i].price.toString()
                , results[i].stock_quantity.toString()
            ])
            numChoicesArr.push(results[i].item_id.toString());
        }
        console.log(`
----------------------------------------------------------
${productsTable.toString()}
----------------------------------------------------------
`)
        inquirer.prompt([
            {
                name: "inventorySelected",
                type: "list",
                choices: numChoicesArr,
                message: "Increase Inventory to which item?"
            }, {
                name: "amount",
                type: "input",
                message: "Increase the Inventory by how much?"
            }
        ]).then(answers => {
            console.log(answers.inventorySelected, answers.amount);
            connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?",[{answers.amount}, {item_id: answers.inventorySelected}])
            connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: stock_quantity - answers.amount }, { item_id: answers.inventorySelected }], (error, result) => {
                if (error) throw error;
            })        
        })
    })
}

function validateAge(age)
{
   var reg = /^\d+$/;
   return reg.test(age) || false;
}

// connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: res[0].stock_quantity - purchaseQuantity }, { item_id: purchaseID }], (error, result) => {
//     if (err) throw err;
//     console.log("Purchase Successful.");
//     console.log("The total will be: $" + res[0].price * purchaseQuantity);
//     connection.end();
// })