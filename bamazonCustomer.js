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
    connection.end();
});

function showProducts() {
    var query = "SELECT * FROM product";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].item_number + "Product Name: " +
                res[i].product_name + " Price: " + res[i].price);
        }
    })
}