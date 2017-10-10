var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "3vil1337",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    showProducts();
});

function showProducts() {
    var query = "SELECT * FROM product";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log("\n");
        console.log("  Item ID:     |     Product Name     |     Department Name     |     Price     |     Stock");
        console.log("-----------------------------------------------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log("       " + res[i].item_number + "              " + res[i].product_name + "              " + res[i].department_name + "                 " + res[i].price + "              " + res[i].stock);
            console.log("                                                                                          ");
        }
        start();
    });
}

function start() {
    inquirer
        .prompt([{
            name: "productID",
            type: "input",
            message: "Select a Product ID:",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                console.log(" <YOU MUST ENTER A QUANTITY>")
                return false;
            }
        }, {
            name: "total",
            type: "input",
            message: "Indicate the quantity you wish to purchase:",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                console.log(" <YOU MUST ENTER A QUANTITY>")
                return false;
            }
        }])
        .then(function(answer) {
            var query = "SELECT item_number, product_name, department_name, price, stock FROM product";
            connection.query(query, { item_number: answer.total, stock: answer.PriceID }, function(err, res) {
                var name = res[0].product_name;
                var stock = res[0].stock;
                var price = res[0].price;
                var updatedStock = parseInt(stock) - parseInt(answer.total);
                var updatedPrice = price++;
                console.log("You have purchased " + answer.total + name + " for a total of $" + answer.total * price);

                function dataChange() {
                    var query = "UPDATE product SET ? WHERE ?";
                    connection.query(query, [{
                        stock: updatedStock
                    }, {
                        price: updatedPrice
                    }])
                }
                dataChange();
                console.log("There are " + updatedStock + name + " available");
                if (stock[0] <= 0) { console.log("Insufficient Quantity!") }
                restart();
            })
        })
}

function restart() {
    inquirer.prompt([{
        name: "restart",
        message: "\n Would you like to order again?",
        type: "list",
        choices: ["Order Again?", "Quit?"]
    }]).then(function(answers) {
        if (answers.restart === "Order Again?") {
            start();
        } else { console.log("\nThanks for your order!"); }
    });
}