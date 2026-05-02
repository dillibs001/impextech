import { Router } from "express";
import { createProductController,
        getAllProductsController,
        getProductByIdController,
        updateProductController,
        deleteProductController
    } from "../controllers/product.controller.js";
import { isAdmin } from "../middleware/auth.middleware.js";
import {expressjwt as checkJwt} from "express-jwt";

const router = Router();

const requireLogin = checkJwt({
    secret: process.env.JWT_SECRET!,
    algorithms: ["HS256"],
});// Middleware to check if the user is logged in

// Public routes for product retrieval
router.get("/products", getAllProductsController);
router.get("/products/:id", getProductByIdController);


// Admin routes for product management
router.put("/products/:id", requireLogin, isAdmin, updateProductController);
router.delete("/products/:id", requireLogin, isAdmin, deleteProductController);
router.post("/products", requireLogin, isAdmin, createProductController);

export default router; // Export the router to be used in the main application file