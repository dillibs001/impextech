import 'dotenv/config';//import dotenv to load environment variables from the .env file
import mongoose from 'mongoose';//import mongoose to interact with the MongoDB database



//connect to mongodb database 
export const connectDb = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in the environment variables");//this is to throw an error if the MONGODB_URI variable is not defined in the .env file
        }
        await mongoose.connect(uri);//this is to connect to the mongodb database using the connection string from the .env file
        console.log("Impextech database connected successfully");
    } catch (err: any) {
        return console.error("Error connecting to the database", err.message);//this is to log any error that occurs during the connection
    }

}
connectDb();//this is to call the connectDb function to connect to the database
