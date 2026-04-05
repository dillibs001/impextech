/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: 
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request (Validation failed)
 */
import type{Request, Response} from "express";

import * as authService from "../services/auth.service.js";

export const register = async( req: Request, res: Response): Promise <void>=> {
    try{
        const{email,password,first_name, last_name} = req.body;

        if(!email || !password || !first_name || !last_name)
        {
            res.status(400).json({message: 'All fields are required', success: false});
            return;
        }
        // Call the registerUser function from the auth service to handle the registration logic
        const result = await authService.registerUser(email, password, first_name, last_name);
        res.status(201).json({message: 'User registered successfully', success: true, data: result});

    }catch (err)
    {
        res.status(400).json({message: 'Error registering user', success: false, error: err instanceof Error ? err.message : 'Unknown error'});
    }
};


export const login = async(req: Request, res: Response): Promise<void> => {
    try{
        const {email, password} = req.body;

        if(!email || !password)
            {
                res.status(400).json({message: 'Email and password are required', success: false});
                return;
            }

             const result = await authService.loginUser(email, password);
                res.status(200).json({message: 'User logged in successfully', success: true, data: result});
        }catch(err:any)
            {
                res.status(401).json({message: 'Invalid email or password', success: false, error: err instanceof Error ? err.message : 'Unknown error'});  
            }
        };
