DROP DATABASE IF EXISTS	bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE bamazon (
item_number int NOT NULL,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price int NOT NULL,
stock int NOT NULL,
PRIMARY KEY (item_number)
);

SELECT * FROM bamazon;




