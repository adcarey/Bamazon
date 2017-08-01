create database bamazon;
use bamazon;
create table products(
item_id integer(11) auto_increment,
product_name varchar(100) not null,
department_name varchar(100) not null,
price decimal(10, 2) not null,
stock_quantity integer(11) not null, 
primary key(item_id)
);
select * from products;
