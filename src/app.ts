import 'dotenv/config';//import dotenv to load environment variables from the .env file
import express from 'express';//import express to create the server and handle routes
import {connectDb} from './db.js';//import the connectDb function to connect to the database
import mongoose from 'mongoose';//import mongoose to interact with the MongoDB database
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import authRoutes from './routes/auth.routes.js';//import the auth routes to handle authentication-related endpoints    
import productRoutes from './routes/product.routes.js';//import the product routes to handle product-related endpoints


const app = express();
app.use(productRoutes);//this is to use the product routes for any endpoint that starts with /products
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));//this is to set up the Swagger UI for API documentation at the /api-docs endpoint
const port = process.env.PORT
app.use (express.json());//this is to parse json data 


app.use('/api/auth', authRoutes);//this is to use the auth routes for any endpoint that starts with /auth


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));//this is to set up the Swagger UI for API documentation at the /api-docs endpoint

    
app.listen (port , () => {
    console.log(`Server is running on http://localhost:${port}`);
}) //this is to start the server.

connectDb();//this is to call the connectDb function to connect to the database


