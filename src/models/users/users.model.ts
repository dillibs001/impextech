import mongoose, {type InferSchemaType,model} from 'mongoose';//import mongoose to interact with the MongoDB database

const userSchema = new mongoose.Schema({
    first_name :{type:String,required:[true, 'First name is required'],trim:true},
    last_name:{type:String, required:[true, 'Last name is required'],trim:true},
    email:{type:String, required:[true,'Email is required'], unique:true, lowercase:true, trim:true},
    password:{type:String, required:[true,'Password is required'], trim:true, minlength:[6, 'Password must be at least 6 characters long']},


}
, {timestamps:true});//this is to create a new schema for the user model with the specified fields and validation rules, and to automatically add createdAt and updatedAt timestamps to the documents

type IUser = InferSchemaType<typeof userSchema>;//this is to create a TypeScript type for the user model based on the user schema, which will be used to define the type of the user data in the application    


const User = model<IUser>('User', userSchema);//this is to create a model for the user schema, which will be used to interact with the users collection in the database

export default User;//this is to export the User model so that it can be used in other files, such as app.ts

