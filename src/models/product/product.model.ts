import mongoose, { type InferSchemaType, model } from "mongoose";//import mongoose to interact with the MongoDB database

const productSchema = new mongoose.Schema({

    name:{type:String, required:[true, 'Product name is required'], trim:true},
    description:{type:String, required:[true, 'Product description is required'], trim:true},
    price:{type:Number, required:[true, 'Product price is required'], min:0},
    category:{type:mongoose.Schema.Types.ObjectId, ref:'Category', required:[true, "A product must belong to a category"]},
    stock:{type:Number, required:[true, 'Product stock is required'], min:0},
    image_url:{type:String, required:[true, 'Product image URL is required'], trim:true},
    user_id:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    inStock:{type:Boolean, default:true},


}, {timestamps:true});//this is to create a new schema for the product model with the specified fields and validation rules, and to automatically add createdAt and updatedAt timestamps to the documents

type IProduct = InferSchemaType<typeof productSchema>;//this is to create a TypeScript type for the product model based on the product schema, which will be used to define the type of the product data in the application

const Product = model<IProduct>('Product', productSchema);//this is to create a model for the product schema, which will be used to interact with the products collection in the database

export default Product;//this is to export the Product model so that it can be used in other files, such as app.ts      
