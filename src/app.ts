import 'dotenv/config';//import dotenv to load environment variables from the .env file
import express from 'express';//import express to create the server and handle routes
import {connectDb} from './db.js';//import the connectDb function to connect to the database
import mongoose from 'mongoose';//import mongoose to interact with the MongoDB database
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import authRoutes from './routes/auth.routes.js';//import the auth routes to handle authentication-related endpoints    
import productRoutes from './routes/product.routes.js';//import the product routes to handle product-related endpoints
import userRoutes from './routes/user.routes.js';//import the user routes to handle user-related endpoints
import cartRoutes from './routes/cart.routes.js';//import the cart routes to handle cart-related endpoints  
import categoryRoutes from './routes/categories.routes.js';//import the category routes to handle category-related endpoints

const app = express();
const port = process.env.PORT
app.use (express.json());//this is to parse json data 

// Set up routes for different functionalities
app.use('/api/v1/auth', authRoutes);//this is to use the auth routes for any endpoint that starts with /auth
app.use('/api/v1/products', productRoutes);//this is to use the product routes for any endpoint that starts with /products
app.use('/api/v1/users', userRoutes);//this is to use the user routes for any endpoint that starts with /users
app.use('/api/v1/cart', cartRoutes);//this is to use the cart routes for any endpoint that starts with /cart
app.use('/api/v1/categories', categoryRoutes);//this is to use the category routes for any endpoint that starts with /categories
app.use('/api/v1-docs', swaggerUi.serve, swaggerUi.setup(specs));//this is to set up the Swagger UI for API documentation at the /api-docs endpoint

   
app.listen (port , () => {
    console.log(`Server is running on http://localhost:${port}`);
}) //this is to start the server.

connectDb();//this is to call the connectDb function to connect to the database


