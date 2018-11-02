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
  purchaseProduct();
});

const purchaseProduct = () => {
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
                name: "itemID",
                type: "list",
                choices: numChoicesArr,
                //  ["1", "2", "3"],
                message: "What is the Item ID of the product you'd like to purchase?"
            }, {
                name: "quantity",
                type: "input",
                message: "How many did you want to purchase?"
            }
        ]).then(answer => {
            let purchaseID = answer.itemID;
            let purchaseQuantity = answer.quantity;
            connection.query("SELECT * FROM products WHERE ?", { item_id: purchaseID }, (err, res) => {
                if (err) throw err;
                if (purchaseQuantity > res[0].stock_quantity) {
                    console.log("Insufficient quantity!");
                    console.log("App Closing...");
                    connection.end();
                } else {
                    connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: res[0].stock_quantity - purchaseQuantity }, { item_id: purchaseID }], (error, result) => {
                        if (err) throw err;
                        console.log("Purchase Successful.");
                        console.log("The total will be: $" + res[0].price * purchaseQuantity);
                        connection.end();
                    })
                }
            })
        
        })
    })
}