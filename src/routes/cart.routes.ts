import { Router } from "express";
import { 
        getCartController, 
        addToCartController, 
        removeFromCartController 
    } from "../controllers/cart.controller.js";
import { requireLogin } from "../middleware/auth.middleware.js";

const router = Router();// Create a new router instance

// Define routes for cart operations
router.get("/", requireLogin, getCartController); // Route to get the cart for the authenticated user
router.post("/add",requireLogin,addToCartController); // Route to add an item to the cart
router.delete("/remove/:productId", requireLogin, removeFromCartController); // Route to remove an item from the cart

export default router; // Export the router to be used in the main application file         
