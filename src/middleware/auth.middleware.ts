import type { Response,NextFunction } from "express";
import type {Request as JWTRequest} from "express-jwt";
import {expressjwt as checkJwt} from "express-jwt";

// Define the interface for the JWT payload
interface TokenPayload {
    id: string;
    email: string;
    role: string;
}

export const requireLogin = checkJwt({
    secret: process.env.JWT_SECRET!,
    algorithms: ["HS256"],
});// Middleware to check if the user is logged in



export const isAdmin = (req: JWTRequest<TokenPayload>, res: Response, next: NextFunction) => {
    if(req.auth && req.auth.role ==='admin'){
        next();
        return;
    }
        res.status(403).json({ message: 'Access denied. Admins only.' ,success:false});   
     
    }

    
