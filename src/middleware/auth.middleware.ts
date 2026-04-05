import type { Response,NextFunction } from "express";
import type {Request as JWTRequest} from "express-jwt";

interface TokenPayload {
    id: string;
    email: string;
    role: string;
}

export const isAdmin = (req: JWTRequest<TokenPayload>, res: Response, next: NextFunction) => {
    if(req.auth && req.auth.role ==='admin'){
        next();
    }
        res.status(403).json({ message: 'Access denied. Admins only.' ,success:false});   
     
    }