In this file we will see how to use all the API features.

# How to use the API

## Run API server

- within console run (npm run start) to start our server.
- I suggest you to use postman for better and easier interaction with the API.

## How to use

steps of using all functionality using postman

### User functionality

1. to create user :  
   a. access (http://localhost:3000/createUser) as POST HTTP  
   b. provide new user info as json body then send, like:  
   {
   "f_name" : "test",
   "l_name" : "test",
   "user_name" : "test",
   "password" : "pass",
   "age" : 50
   }  
   c. You will receive back your user token , this is your key for every functionality throw the API, so keep it safe.  
   d. now you are a valid user (:  

2. Login user with token to be able to access sensitive routes:  

   a. from postman hit "Authorization".  
   b. from types choose "Bearer token".  
   c. In token box, enter your token that you were presented with when you created your account.  
   d. now you are logged in>  

3. Show all users:  

   a. access (http://localhost:3000/showAllUsers) as GET HTTP  
   b. You will be provided with all the users created in.  
   c. you should be logged in.  

4. Show one user:  

   a. access (http://localhost:3000/showOneUser/:id) as GET HTTP EX => <http://localhost:3000/showOneUser/3> , id is the user id inside the DB.  
   b. You will be provided with the user data.  
   c. you should be logged in.  

5. update User:  

   a. access (http://localhost:3000/updateUser) as POST HTTP  
   b. provide new user info as json body then send, like:  
   {
   "f_name" : "test",
   "l_name" : "test",
   "user_name" : "test",
   "age" : 50
   }  
   c. You will receive your new user info.  
   d. you should be logged in.  
   e. update doesn't change password.  
   f. this model will update your own user associated with the token you are providing  

6. authenticate User:  

   authenticateUser takes user_id and password then check if they are correct.  
   a. access (http://localhost:3000/authenticateUser) as GET HTTP  
   b. provide user_name and your original password as json body then send, like:  
   {
   "password" : "test",
   "user_name" : "test",
   }  
   c. doesn't require logging in.  
   d. provided with password and username, to check if valid or not.  
   e. returns "your input data is correct" if ok, else returns "null"  

7. Delete user:  

   a. access (http://localhost:3000/deleteUser) as DELETE HTTP  
   b. dosnt need any data to be passed, it will detect your token automatically, then extract your id from it, then delete your profile.  
   c. you should be logged in.  

### Products functionality  

Product table schema:  
id SERIAL PRIMARY KEY,  
name VARCHAR(100) NOT NULL,  
price INTEGER NOT NULL,  
category VARCHAR (100)  

1. Create product:  

   a. access (http://localhost:3000/createProduct) as POST HTTP  
   b. provide product data as json body then send, like:  
   {
   "name" : "test",
   "price" : 100,
   "category" : "tv"
   }  
   c. product info will be returned  
   d. you should be logged in.  

2. Show all products:  

   a. access (http://localhost:3000/allProducts) as GET HTTP  
   b. this will return all the products.  
   c. dosnt require logging in.  

3. Show all products ordered by category:  

   a. access (http://localhost:3000/allProductsByCategory) as GET HTTP  
   b. this will return all the products ordered by category.  
   c. dosnt require logging in.  

4. Show one product:  

   a. access (http://localhost:3000/showProduct/:id) as GET HTTP, EX => <http://localhost:3000/showProduct/3> , id is the product id inside the DB.  
   b. You will be provided with the product data.  
   c. dosnt require logging in.  

5. Delete product:  

   a. access (http://localhost:3000/deleteProduct/:id) as DELETE HTTP, EX => <http://localhost:3000/deleteProduct/3> , id is the product id inside the DB.  
   b. You will be provided with the product data.  
   d. you should be logged in.  

### Orders functionality:  

Order table schema:  
id SERIAL PRIMARY KEY,  
status VARCHAR(15) DEFAULT 'open',  
user_id BIGINT REFERENCES users(id) NOT NULL  

1. Create order:  

   a. access (http://localhost:3000/createOrder/:id) as POST HTTP , <id> is for the user  
   b. dos'nt need body to be sent  
   c. order info will be returned.  
   d. you should be logged in  
   e. order() opens new order for specific user.  

2. Show all orders:  

   a. access (http://localhost:3000/showAllOrders) as GET HTTP  
   b. this will return all the orders for all users.  
   d. you should be logged in  

3. Show one order:  

   a. access (http://localhost:3000/showOneOrder/:id) as GET HTTP, EX => <http://localhost:3000//showOneOrder/3> , id is the order id inside the DB.  
   b. You will be provided with the specific order data.  
   d. you should be logged in  

4. Add new order product relation inside orders_products table:  

   a. access (http://localhost:3000/addToOrder/:id/product) as POST HTTP , <id> is for the user  
   b. provide orders_products data as json body then send, like:  
   {
   "order_id" : 1,
   "product_id" : 1,
   "quantity" : 10"
   }  
   c. orders_products info will be returned.  
   d. you should be logged in  
   e. this table will help us connect between users and their orders and products inside these orders.  

## Steps order to use the API  

1. Create new user, then keep the returned token.  
2. login by adding your token into postman => Authorization => Bearer Token => insert your token inside token box.  
3. create new product.  
4. create new order.  
5. create new orders_products relation.  
6. View user dashboard by accessing (http://localhost:3000//userDashboard/:id) while id is the user id we want to access, to see all of our oder details.  
7. feel free to update or delete users, products and orders as you like (:  
