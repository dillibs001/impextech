import type {Request, Response} from "express";

import { getUserById,getAllUsers,updateUser as updateUserService,deleteUser } from "../services/user.service.js";
import type User from "../models/users/users.model.js";


// 1. GET SINGLE USER
export const getUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id; // Get the ID from the URL (e.g., /api/users/12345)
                if (!userId || typeof userId !== 'string') {
            res.status(400).json({
                success: false,
                message: "Invalid User ID provided",
            });
            return;
        }
        const user = await getUserById(userId); // Call the service function to get the user by ID
        
        res.status(200).json({ success: true, data: user});
    } catch (error: any) {
        res.status(404).json({ success: false, message: error.message || "User not found" });
    }
};

;;  // 2. GET ALL USERS(adminonly)
export const getUsersController = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getAllUsers(); // Call the service function to get all users
        
        res.status(200).json({ success: true, data: users, count: users.length });
    }
        catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Failed to retrieve users" });
    }
};

//UPDATE USER 
export const updateUserController = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.params.id; // Get the ID from the URL (e.g., /api/users/12345)
                if (!userId || typeof userId !== 'string') {
            res.status(400).json({
                success: false,
                message: "Invalid User ID provided",
            });
            return;
        }
        
        
        const updateData: Omit<Partial<typeof User>, 'password'> = req.body; // Get the updated user data from the request body
        const updatedUser = await updateUserService(userId, updateData); // Call the service function to update the user
        res.status(200).json({ success: true, data: updatedUser });
    }catch (error: any) {
        if (error.message === "User not found") {
            res.status(404).json({
                success: false,
                message: error.message,
            });
            return;
        }

        if (error.name === "ValidationError") {
            res.status(400).json({
                success: false,
                message: error.message,
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Failed to update user",
        });
    }
};

export const deleteUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id; // Get the ID from the URL (e.g., /api/users/12345)

        if (!userId || typeof userId !== 'string') {
            res.status(400).json({
                success: false,
                message: "Invalid User ID provided",
            });
            return;
        }

        const deletedUser = await deleteUser(userId); // Call the service function to delete the user
        res.status(200).json({ success: true, message: "User deleted successfully"});

    }
    catch (error: any) {
        if (error.message === "User not found") {
            res.status(404).json({
                success: false,
                message: error.message,
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Failed to delete user",
        });
    }
};  