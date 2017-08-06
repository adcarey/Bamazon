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
	options();
	});

function options(){
	inquirer
		.prompt([
		{

			name: "options",
			type: "rawlist",
			message: "Select from the menu?",
			choices: [
				"View Products for Sale",
				"View Low Inventory",
				"Add to Inventory",
				"Add New Product",
			] 
		}
			])
			.then(function(answer){
				if(answer.options === "View Products for Sale"){
					allProducts();
				} else if(answer.options === "View Low Inventory"){ 
					lowInventory();
				} else if(answer.options === "Add to Inventory"){
					addInventory();
				} else{
					newProduct();
				}
			}); 
};

	function allProducts(){
	connection.query("select * from products", function(err, res){
		for (var i = 0; i < res.length; i++){
			console.log("Item ID: " + res[i].item_id + " | " + "Product Name: " + res[i].product_name + " | " + "Price: " + res[i].price + " | " + "Stock Quantity: " + res[i].stock_quantity);
			}
			inquirer
				.prompt([
				{
					name: "nextStep",
					type: "rawlist",
					message: "What do you want to do?",
					choices: [
					"Back to main menu",
					"Exit"
					]
				}
				])
				.then(function(answer){
					if(answer.nextStep === "Back to main menu"){
						options()
					} else{
						process.exit();
					}
				})
		
	});
}
function lowInventory(){
	connection.query("select * from products Where stock_quantity < 6", function(err, res){
		for (var i = 0; i < res.length; i++){
			console.log("Item ID: " + res[i].item_id + " | " + "Product Name: " + res[i].product_name + " | " + "Price: " + res[i].price + " | " + "Stock Quantity: " + res[i].stock_quantity);
			}
			inquirer
				.prompt([
				{
					name: "nextStep",
					type: "rawlist",
					message: "What do you want to do?",
					choices: [
					"Back to main menu",
					"Exit"
					]
				}
				])
				.then(function(answer){
					if(answer.nextStep === "Back to main menu"){
						options()
					} else{
						process.exit();
					}
				});

});
};

function addInventory(){
	connection.query("SELECT * From products", function(err, res){
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
		message: "which product ID would you like to add to?"
			},
			{
				name: "quantity",
				type: "input",
				message: "How many do you want to add?"
			}

				])
			.then(function(answer){
				var chosenProduct;
				for (var i = 0; i <res.length; i++){
					if (res[i].item_id + " " + res[i].product_name === answer.product){
						chosenProduct = res[i];
					}
				}
				if(i < res.length){
					console.log("invalid input!")
					addInventory();
				}else{
						connection.query(
        		"UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", 
        		[answer.quantity, chosenProduct.item_id],
        		 function(error) {
              if (error) throw err;
              console.log("You added " + answer.quantity + " " + chosenProduct.product_name);
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
               			addInventory();
               		}
               	});
            });
				}
			})
			});
			}
		

function newProduct(){
	inquirer
		.prompt([
		{
			name: "product",
			type: "input",
			message: "What is the product name?"
		},
		{
			name: "department",
			type: "input",
			message: "What department is this product in?"
		},
		{
			name: "price",
			type: "input",
			message: "How much is this product?"
		},
		{
			name: "quantity",
			type: "input",
			message: "What is the initial quantity you would like to purchase?"
		}
			])
			.then(function(answer){
				connection.query(
					"INSERT INTO products(product_name, department_name, price, stock_quantity) values(?, ?, ?, ? )",
					[answer.product, answer.department, parseInt(answer.price), parseInt(answer.quantity)],
					function(error){
						if (error) throw err;
						console.log("You just added " + parseInt(answer.quantity) + " " + answer.product + "'s to the inventory!")
						inquirer
							.prompt([
							{
								name: "next",
								type: "rawlist",
								choices: [
								"Return To Main Menu?",
								"Add another product",
								"Exit"
								],
								message: "What do you want to do now?"
							}
								]).then(function(answer){
									if(answer.next === "Return To Main Menu?"){
										options();
									} else if(answer.next === "Add another product"){
										newProduct();
									} else{
										process.exit();
									}
								})
							}
					)

			})
		
		};



