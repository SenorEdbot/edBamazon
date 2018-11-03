# edBamazon
### By Eddie Franco

## Bamazon Customer
This javascript file will allow the customer to see all products available for purchase, select which product they want to purchase, and displays their final total.
I have updated the bamazonCustomer to Update both the quantity and product_sales in the database. 
product_sales is not displayed to the customer here however so I wanted to highlight this in the readMe. 

## Bamazon Manager
This javascript file allows the manager to compelte basic tasks. 
- View all inventory
- View all low inventory (anything under 5)
- Add inventory to a certain product
- Add a new product for sale
The manager will be able to perform as many tasks as they want by running the program just one time. When finished, the manager can push Exit.

## Bamazon Supervisor
I had a work trip that involves an 8 hour road trip so I wasn't able to fully complete this one. 
I was able to modify the bamazonCustomer.js file so the product_sales column is updated when a customer makes a purchase. 
I created the database and have thought through the code needed to complete this portion. 

### Sudo Code Ideas
I will need to run a nested query to return the product_sales for each department.
I will need logic to determine the profit

Once the nested query is complete the rest should fall into place nicely. I'm excited to go back and finish this portion after my work trip. 
MySQL is amazing with all it can do, this section was a blast. 