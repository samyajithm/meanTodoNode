# NgShop
A Simple MEAN.js E-Commerce Application (Repo for Node + Express backend source code)

## Dependencies

 * Node: 12.16.2
 * [body-parser: 1.19.0](https://www.npmjs.com/package/body-parser)
 * [express: 4.17.1](https://www.npmjs.com/package/express)
 * [mongoose: 5.9.22](https://www.npmjs.com/package/mongoose)
 * [morgan: 1.10.0](https://www.npmjs.com/package/morgan) - For logging HTTP requests

## Dev Dependencies
 * [nodemon: 2.0.4](https://www.npmjs.com/package/nodemon)

## Features
  * Inventory Management with modules - Store, Products, Orders
  * Store module :-
        * Endpoint : /stores 
        * method: `GET`, `POST` , `DELETE`
        * Operations: Add, Fetch all, Remove Store
  * Products module :-
        * Endpoint : /products 
        * method: `GET`, `POST` , `DELETE`, `Patch`
        * Operations: Add, Fetch all, Fetch One, Update, Remove Product
  * Orders module :-
        * Endpoint : /orders 
        * method: `GET`, `POST` , `DELETE`
        * Operations: Create , Fetch all, Fetch One, Cancel Order
  
  * All the operations can be done by using API from this [Postman collection](https://documenter.getpostman.com/view/11998783/T1DiGg6m) 

  * Added products can be viewed in Frontend Application [ngCart](https://samyajithm.github.io/ngCart/shop) developed using Angular. Features available are listed in [Repo of ngCart](https://github.com/samyajithm/ngCart.git)
   **Note**: Product is fetched by making actual api call to endpoint `/products` and the placing orders are just a mock in Frontend App

## MongoDB connection 
* MongoDB Hoisted in MongoDB Atlas 
    * Connect to Application URI -(mongodb+srv://ngShop:ngShop@ngshop.0h5cq.mongodb.net/ngShop?retryWrites=true&w=majority)
    * Connect using Mongodb compass - (mongodb+srv://ngShop:ngShop@ngshop.0h5cq.mongodb.net/test) 
    * Connect with Mongo Shell - (mongo "mongodb+srv://ngshop.0h5cq.mongodb.net/<dbname>" --username ngShop)

* Config.json is used to provide db connection details
* Open `<project folder>\server\config\config.json` and

Sample Connection details for local db instance
```json
{
  "env": {
    "remoteDb": false,
    "dbHost": "127.0.0.1:27017/meanTodo?retryWrites=true&w=majority",
    "dbUserName": "",
    "dbPassword": ""
  }
}
```
Sample Connection details for remote db instance
```json
{
  "env": {
    "remoteDb": true,
    "dbHost": "@meanTodo.0h5cq.mongodb.net/meanTodo?retryWrites=true&w=majority",
    "dbUserName": "meanTodo",
    "dbPassword": "meanTodo"
  }
}
```  

## Development server

* Navigate to `\ngShop` and Run `npm install`.
* Run `npm run serve` for a dev server using nodemon or Run `npm run start`. Navigate to `http://localhost:3000/`.


## Demo

* [Backend Hoisting](https://ngshop.glitch.me/stores)
* [POSTMAN COLLECTION](https://documenter.getpostman.com/view/11998783/T1DiGg6m)
* [FrontEnd Hoisting](https://samyajithm.github.io/ngCart/shop)
