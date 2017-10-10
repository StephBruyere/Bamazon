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
});

function showProducts() {
    var query = "SELECT * FROM product";
    connection.query(query, function(err, res) {
        console.log("\n");
        console.log("***************************************************************************************************");
        console.log(" ~ Welcome To Our Ye Olde Shoppe ~ ");
        console.log("***************************************************************************************************");
        console.log("  Item ID:     |     Product Name     |     Department Name     |     Price     |     Stock");
        console.log("-----------------------------------------------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log("       " + res[i].item_number + "              " + res[i].product_name + "              " + res[i].department_name + "                 " + res[i].price + "              " + res[i].stock);
            console.log("                                                                                          ");
        }
        addInventory();
    });
}

function manage() {
    inquirer
        .prompt([{
            name: "options",
            type: "list",
            message: "What would you like to do?: ",
            choices: ["View Product", "View Low Inventory", "Add Inventory", "Add New Product"],
            validate: Boolean
        }])
        .then(function(answer) {
            if (answer.options === "View Product") {
                viewProduct();
            }
            if (answer.options === "View Low Inventory") {
                viewInventory();
            }
            if (answer.options === "Add Inventory") {
                showProducts();
            }
            if (answer.options === "Add New Product") {
                addProduct();
            }
        })
}

function viewProduct() {
    var query = "SELECT * FROM product";
    connection.query(query, function(err, res) {
        console.log("\nInventory Management System: \n")
        for (var i = 0; i < res.length; i++) {
            console.log("       " + res[i].item_number + "              " + res[i].product_name + "              " + res[i].department_name + "                 $" + res[i].price + "              " + res[i].stock);
            console.log("                                                                                          ");
        }
        manage();
    })
}

function viewInventory() {
    console.log("\nInventory Management System: Low Inventory\n")
    var query = "SELECT * FROM product WHERE stock < 5";
    connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("  Product ID: " + res[i].item_number + "\n  Product Name: " + res[i].product_name + "\n  Quantity: " + res[i].stock);
            console.log("_____________________________________________");
        }
        console.log("\n");
        manage();
    });
}

function addInventory() {
    inquirer
        .prompt([{
            name: "productID",
            type: "input",
            message: "Select a Product ID to add to inventory:",
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
            message: "How much would you like to add to inventory: \n",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                console.log(" <YOU MUST ENTER A QUANTITY>")
                return false;
            }
        }])
        .then(function(answer) {
            var newTotal = answer.total;
            var query = "SELECT * FROM product";
            connection.query(query, function(err, res) {
                var i = answer.productID - 1;
                var name = res[i].product_name;
                var stock = res[i].stock;
                var updatedStock = parseInt(res[i].stock) + parseInt(answer.total);
                console.log("You have added " + answer.total + res[i].product_name);

                function dataChange() {
                    var query = "UPDATE product SET ? WHERE ?";
                    connection.query(query, [{
                        stock: updatedStock
                    }, {
                        item_number: answer.productID
                    }]);
                    console.log("There are " + updatedStock + res[i].product_name + " available \n");
                }
                dataChange();
                manage();
            })
        });
}

function addProduct() {
    inquirer.prompt([{
        name: "item_number",
        type: "input",
        message: "\nPlease specify product ID"
    }, {
        name: "product_name",
        type: "input",
        message: "What would like to add?"
    }, {
        name: "department_name",
        type: "input",
        message: "Please specify a department?"
    }, {
        name: "price",
        type: "input",
        message: "Please input the products price?"
    }, {
        name: "stock",
        type: "input",
        message: "Please input the quantity you would like to stock: "
    }]).then(function(answer) {
        connection.query("INSERT INTO product SET ?", {
            item_number: answer.item_number,
            product_name: answer.product_name,
            department_name: answer.department_name,
            price: answer.price,
            stock: answer.stock
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                console.log("Added " + answer.stock + " " +
                    answer.product_name);
            }
        });
    });
};

manage();