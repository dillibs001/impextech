import { Router } from "express";
import {
    createCategoryController,
    getAllCategoriesController,
    getCategoryByIdController,
    updateCategoryController,
    deleteCategoryController
} from "../controllers/categories.controller.js";

import {isAdmin,requireLogin } from "../middleware/auth.middleware.js";


const router = Router(); // Create a new router instance

// Define routes for category operations
router.post("/create", requireLogin, isAdmin, createCategoryController); // Route to create a new category (admin only)
router.get("/", getAllCategoriesController); // Route to get all categories
router.get("/:id", getCategoryByIdController); // Route to get a category by ID
router.put("/update/:id", requireLogin, isAdmin, updateCategoryController); // Route to update a category by ID (admin only)
router.delete("/delete/:id", requireLogin, isAdmin, deleteCategoryController); // Route to delete a category by ID (admin only)

export default router; // Export the router to be used in the main application file 