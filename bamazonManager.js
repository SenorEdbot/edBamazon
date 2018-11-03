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
                // start();       
                break;
            case "View Low Inventory":
                displayLowInventory();
                // start();
                break;
            case "Add to Inventory":
                addInventory();
                // start();
                break;
            case "Add New Product":
                addNewProduct();
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
    console.log(("-").repeat(30));
    start();
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
    console.log(("-").repeat(30));
    start();
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
                name: "inventory",
                type: "list",
                choices: numChoicesArr,
                message: "Increase Inventory to which item?"
            }, {
                name: "amount",
                type: "input",
                message: "Increase the Inventory by how much?"
            }
        ]).then(answers => {
            let selectedInvAmount = results[answers.inventory-1].stock_quantity;
            console.log(selectedInvAmount);
            connection.query("UPDATE products SET ? WHERE ?",[
                {
                    stock_quantity: selectedInvAmount + parseFloat(answers.amount)
                },
                {
                    item_id: answers.inventory
                }
            ],(error) => {
                if (error) throw error;
                console.log(results[answers.inventory-1].product_name + " inventory was increased.");
                console.log(("-").repeat(30));
                start();
            })
        })
    })
}

const addNewProduct = () => {
    inquirer.prompt([
        {
            name: "name",
            message: "What is the Product Name?"
        }, {
            name: "department",
            message: "What is the Department Name?"
        }, {
            name: "price",
            message: "What is the Price?",
            type: "number"
        }, {
            name: "quantity",
            message: "What is the Quantity?",
            type: "number"
        }
    ]).then(answers => {
        console.log(answers);
        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES(?,?,?,?)",[answers.name, answers.department, answers.price, answers.quantity], (err, res)=>{
            if (err) throw err;
            console.log(answers.name + " Added");
            console.log(("-").repeat(30));
            start();
        })
    })
}



// function validateAge(age) {
//    var reg = /^\d+$/;
//    return reg.test(age) || false;
// }

// connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: res[0].stock_quantity - purchaseQuantity }, { item_id: purchaseID }], (error, result) => {
//     if (err) throw err;
//     console.log("Purchase Successful.");
//     console.log("The total will be: $" + res[0].price * purchaseQuantity);
//     connection.end();
// })