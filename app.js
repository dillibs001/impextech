require('dotenv').config();//load variables from .env file 
const express = require('express');
const mongoose = require('mongoose');





const app = express();
const port = 3000;
app.use (express.json());//this is to parse json data 

const gadgets = [
    {id:1, name : "iPhone 16 Pro Max", price : "N 1,800,000", condition : "New"},
    {id:2, name : "Macbook Air M2", price : "N 1,200,000", condition : "Used"},
    {id:3 , name: "Samsung Galaxy S23 Ultra", price : "N 1,500,000", condition : "New" }
] //this is a sample data of products

app.get('/products', (req, res) =>{
    res.json(gadgets);
})//this is to get all products



app.post ('/products', async(req, res) =>{
    try{
        const newProduct =  new Product({
            name: req.body.name, 
            price : req.body.price,
            condition: req.body.condition,
            inStock: req.body.inStock,
         
        });//this is to create a new product using the Mongoose model 

        const savedProduct = await newProduct.save();//this is to save the new product to the database

        res.status(201).json({message:"Product added successfully to impextech database", success:true, data: savedProduct});//this is to send a response back to the client with the saved product data

    }catch (err){
        res.status(400).json({message:"Error adding product to impextech database", success: false, error: err.message});//this is to send a response back to the client with the error message if there is an error while saving the product to the database   

    }
    });


    
app.listen (port , () => {
    console.log(`Server is running on http://locahhost:${port}`);
}) //this is to start the server.

//connect to mongodb database 
const connectDb = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);//this is to connect to the mongodb database using the connection string from the .env file
        console.log ("Impextech database connected successfully");
    } catch (err){
        console.error("Error connecting to the database", err);//this is to log any error that occurs during the connection
        process.exit(1); //this is to exit the process with failure
    }
    }
connectDb();//this is to call the connectDb function to connect to the database



const productSchema = new mongoose.Schema({
    name: {type:String, required:[true, 'Product name is required']},
    price:{type:String, required:[true, 'Product price is required']},
    inStock:{type:Boolean, defautl:true},
    condition:{type:String, enum:['New', 'Used','Open Box'], required:[true, 'Product condition is required']}},
    {timestamps:true},//this automatically adds a timestamp to each product when it is created
); //this is to create a schema for the product model

const Product = mongoose.model('Product', productSchema);//this is to create a model for the product schema