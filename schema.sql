DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(55) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Headphones", "Electronics", 50.00, 15), ("Screwdriver", "Tools", 2.50, 50), ("Sorry", "Games", 9.99, 8), ("Socks", "Clothing", 6.99, 200), ("Router", "Electronics", 150.00, 4), ("Tape Measure", "Tools", 12.99, 25), ("Clue", "Games", 11.99, 7), ("Beanie", "Clothing", 25.99, 50), ("Flash Drive", "Electronics", 19.99, 50), ("Level", "Tools", 8.99, 40);