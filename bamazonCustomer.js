var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	//username
	user: "root",

	//password
	password: "1234",
	database: "bamazon"
});
connection.connect(function(err){
	if(err) throw err;
	console.log("connected as id  " + connection.threadId);
	allProducts();
	

	});

function allProducts(){
	connection.query("select * from products", function(err, res){
		for (var i = 0; i < res.length; i++){
			console.log("Item ID: " + res[i].item_id + " | " + "Product Name: " + res[i].product_name + " | " + "Price: " + res[i].price + " | " + "Stock Quantity: " + res[i].stock_quantity);

		}
	});
purchase();
}

function purchase(){
    connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
inquirer
	.prompt([
    {
          name: "product",
          type: "rawlist",
          choices: function() {
            var choiceArray = []
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].item_id + " " + res[i].product_name);
            }
            return choiceArray;
          },
		message: "which product ID would you like to purchase?"
	},
	{
		name: "quantity",
		type: "input",
		message: "How many do you want to purchase?"
	}
	])
	.then(function(answer){

		var chosenProduct;
        for (var i = 0; i < res.length; i++) {
          if (res[i].item_id + " " + res[i].product_name === answer.product) {
            chosenProduct = res[i];
          }
        } 
        if (chosenProduct.stock_quantity < parseInt(answer.quantity)){
        	console.log("Insufficient quantity!")
        	purchase();
        } else {
        	connection.query(
        		"UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", 
        		[answer.quantity, chosenProduct.item_id],
        		 function(error) {
              if (error) throw err;
              console.log("Your total cost is: $" + answer.quantity * chosenProduct.price);
               inquirer
              	.prompt([
              	{
              		type: "confirm",
              		name: "doneOrdering",
              		message: "Is that your final order?"
              	}
               	]).then(function(answer){
               		if(answer.doneOrdering){
               			process.exit();
               		}else{
               			allProducts();
               		}
               	});
            });
        }
	});
});
}