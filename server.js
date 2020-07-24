
//
const express = require("express");
const bodyParser = require("body-parser"); // left spelling is variable name & right is external package name
const fs = require("fs");   //fs is a built in library that does not need to be installed )
const { response } = require("express");

//create my server 
const app = express();

//install the body-parser middleware - allows us to read JSON from requests
app.use(bodyParser.json());  //if the body-parser is not installed you cannot read a request from json


//READ IN JSON FILE (mock-database)
//using try catch is a good way to test reading from a file 
let products =[];

try { 
    products =JSON.parse(fs.readFileSync('products.json')).products;
    
} catch (error) {
    console.log('No Existing File.');    
}
console.log(products);

//defining our HTTP resource Methods
//API Endpoints or Routes - something you can hit or call via HTTP

//GET ALL PRODUCTS
//GET /api/products
app.get('/api/products', (request,response) => {
response.send(products);
});



//GET a specific product by ID
//GET /api/products/:()
app.get("/api/products/:id", (request,response) =>{
   const productId= Number(request.params.id);

//Number -> is a global function provided by JavaScript
   const product =products.find((p) => {
       if (productId === p.id) {
           return true;
       }
   });
   //product = undefined => resolves to false
   // !undefined => !false => resolves to true
   if(!product) {
    response.send(`prouct with id${productId} not found`);
    return;
   }
   //if here we can assume the product does exist - response that it was found
   response.send(product);
});

app.post('/api/products',(request, response) => {

    const body = request.body;
    
    //validate the json body to have the requred properties
    /*required prooperties: 
    -id
    -name
    -price
    */
    if (!body.id  || !body.name  || !body.price)  {
        response.send("Bad Request. Validation Error missing id, name, or price!");
        return;
    } 
    products.push(body);

const jsonPayload = {
    products: products,
};
fs.writeFileSync("products.json",JSON.stringify(jsonPayload));

response.send();
});

//CREATE a new Product with POST 
//POST /api/products { id: 123, name:"apples", price: 4.99}

//UPDATE AN EXISTING PRODUCT BY ID 
//PUT /api/products/:id
app.put("/api/products/:id", (request, response) => {
const productId = Number(request.params.id);


 const product = products.find((p) =>{
     return productId === p.id;
 });

 if(!product) {

    response.send(`Product with id ${productId} not found!`);
 return;
 }
 const body = request.body;

 if(body.name) {
     product.name = body.name;
 }
if (body.price) {
    product.price = body.price;
}
const jsonPayload = {
    products:products
};
fs.writeFileSync("products.json", JSON.stringify(jsonPayload));
response.send();


  
});

// DELETE AN EXISTING PRODUCT BY ID
//DELETE /api/products/:id

app.delete("/api/products/:id", (request,response)=> {
    const productId =Number(request.params.id);

    const productIndex = products.findIndex((p) => {
        return productId === p.id;
    });
    if (productIndex === -1) {
        response.sendstatus(`Product with ${productId} not found`);
        return;
    }
    products.splice(productIndex,1);
    const jsonPayload ={
        produts: products,
    };
    fs.writeFileSync("products.json", JSON.stringify(jsonPayload));
    response.send("You have successfuly deleted the item");
});

//start server 
const port = process.env.PORT ? process.env.PORT :3000;
app.listen(port, ()=> {
console.log("Grocery API server Starter!");
});
