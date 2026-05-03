import dotenv from "dotenv";
import User from "../models/users/users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, saltRounds);
};// Function to generate JWT token

export const comparePassword = async(password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};//comparing the password with the hashed password

export const generateToken = (userId: string, userEmail: string, userRole:string): string => {
    return jwt.sign(
        { id: userId, email: userEmail , role:userRole}, // We build the payload
        JWT_SECRET, 
        { expiresIn: '1h' }
    );
}; 


export const registerUser = async (email: string, password: string,first_name: string, last_name: string): Promise<{ token: string, user: any }> => {
    
    //validate password
    if(password.length <6)
        {
            throw new Error('Password must be at least 6 characters long');
        }
    
    const existingUser = await User.findOne({ email });
     if (existingUser) {
         throw new Error('User already exists');
     }

     const hashedPassword = await hashPassword(password);
     const newUser = new User({ email, password: hashedPassword, first_name, last_name});
     const token = generateToken(newUser._id.toString(), newUser.email, newUser.role);
     await newUser.save();

     
     return { user: { id: newUser._id, email: newUser.email, name: newUser.first_name },
     token};   

}

export const loginUser = async (email: string, password: string): Promise<{ token: string, user: any }> => {
    const user = await User.findOne({ email }).select('+password'); // We need to select the password field explicitly since it's excluded by default
    if(!user)
    {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if(!isPasswordValid)
    {
        throw new Error('Invalid email or password');
    }

    const token = generateToken(user._id.toString(), user.email, user.role);
    return { user: { id: user._id, email: user.email, name: user.first_name }, token };

}