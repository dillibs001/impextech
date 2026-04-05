import 'dotenv/config';//import dotenv to load environment variables from the .env file
import express from 'express';//import express to create the server and handle routes
import {connectDb} from './db.js';//import the connectDb function to connect to the database
import mongoose from 'mongoose';//import mongoose to interact with the MongoDB database
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import authRoutes from './routes/auth.routes.js';//import the auth routes to handle authentication-related endpoints    


const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));//this is to set up the Swagger UI for API documentation at the /api-docs endpoint
const port = process.env.PORT || 3000;
app.use (express.json());//this is to parse json data 


app.use('/api/auth', authRoutes);//this is to use the auth routes for any endpoint that starts with /auth

app.post ('/products', async(req, res) =>{
    try{
        const newProduct =  new Product({
            name: req.body.name, 
            price : req.body.price,
            condition: req.body.condition,
            inStock: req.body.inStock,
         
        });//this is to create a new product using the Mongoose model 

        const savedProduct = await newProduct.save();//this is to save the new product to the database

       return res.status(201).json({message:"Product added successfully to impextech database", success:true, data: savedProduct});//this is to send a response back to the client with the saved product data

    }catch (err)
    {
        if(err instanceof Error){
            return res.status(400).json({message:"Error adding product to impextech database", success: false, error: err.message});//this is to send a response back to the client with the error message if there is an error while saving the product to the database   
        }
        else{ return res.status(400).json({message:"An unknown error occurred while adding product to impextech database", success: false, error: "Unknown error"});//this is to send a response back to the client with a generic error message if the error is not an instance of Error}
    }

    }

    });

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));//this is to set up the Swagger UI for API documentation at the /api-docs endpoint

    
app.listen (port , () => {
    console.log(`Server is running on http://locahhost:${port}`);
}) //this is to start the server.

connectDb();//this is to call the connectDb function to connect to the database




const productSchema = new mongoose.Schema({
    name: {type:String, required:[true, 'Product name is required']},
    price:{type:String, required:[true, 'Product price is required']},
    inStock:{type:Boolean, defautl:true},
    condition:{type:String, enum:['New', 'Used','Open Box'], required:[true, 'Product condition is required']}},
    {timestamps:true},//this automatically adds a timestamp to each product when it is created
); //this is to create a schema for the product model

const Product = mongoose.model('Product', productSchema);//this is to create a model for the product schema