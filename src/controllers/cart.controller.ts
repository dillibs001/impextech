import {
        getCartByUserId as getCartByUserIdService,
        addItemToCart as addItemToCartService,
        removeItemFromCart as removeItemFromCartService
    } from "../services/cart.service.js";
import type { Request, Response} from "express";
import type {Request as JWTRequest} from "express-jwt";

// Controller to get the cart for the authenticated user
export const getCartController = async (req: JWTRequest, res: Response): Promise<void> => {
    try {
        const userId = req.auth?.id; // Assuming the user's ID is stored in the JWT token
        
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized access' });
            return;
        }
        const cart = await getCartByUserIdService(userId); // Call the service function to get the cart by user ID
        res.status(200).json({ message: 'Cart retrieved successfully', success: true, data: cart });
    } catch (error) {
        //check if error is an instance of Error and has a message property
            if (error instanceof Error) {       
                res.status(500).json({ message: error.message || 'Failed to retrieve cart', success: false });
            } else {
                res.status(500).json({ message: 'unexpected error occurred', success: false });

            }
        
    }
};

//add to cart 
export const addToCartController = async (req: JWTRequest, res: Response): Promise<void> => {
    try {
        const userId = req.auth?.id; // Assuming the user's ID is stored in the JWT token
        const { productId, quantity } = req.body; // Get product ID and quantity from request body
        
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized access' });
            return;
        }
        if (!productId || !quantity) {
            res.status(400).json({ message: 'Product ID and quantity are required' });
            return;
        }
        
        const updatedCart = await addItemToCartService(userId, productId, quantity);
        res.status(200).json({ message: 'Item added to cart successfully', success: true, data: updatedCart });
    }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message || 'Failed to add item to cart', success: false });
            } else {
                res.status(500).json({ message: 'unexpected error occurred', success: false });

            }
        
    }
};

//remove from cart 
export const removeFromCartController = async (req: JWTRequest, res: Response): Promise<void> => {
    try {
        const userId = req.auth?.id; // Assuming the user's ID is stored in the JWT token
        const productId = req.params.productId; // Get product ID from request body
        // Validate productId and userId
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized access' });
            return;
        } 
        
        if (!productId || Array.isArray(productId)) {
            res.status(400).json({ message: 'Invalid product ID' });
            return;
        }   

        const updatedCart = await removeItemFromCartService(userId, productId);
        res.status(200).json({ message: 'Item removed from cart successfully', success: true, data: updatedCart });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message || 'Failed to remove item from cart', success: false });
        }
        else {
            res.status(500).json({ message: 'unexpected error occurred', success: false });

        }
    }
};