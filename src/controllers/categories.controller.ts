import type {Response, Request} from "express";
import{
    createCategoryService,
    getAllCategoriesService,
    getCategoryByIdService,
    updateCategoryService,
    deleteCategoryService
} from "../services/categories.service.js";
import { get } from "node:http";

//create category
export const createCategoryController = async(req: Request, res: Response) => {
    try {
        const { name, description } = req.body; // Get category name and description from request body
        const newCategory = await createCategoryService(name, description); // Call the service function to create a new category
        res.status(201).json({ message: 'Category created successfully', success: true, data: newCategory }); // Send success response with the created category data
    } catch (error)
    {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message || 'Failed to create category', success: false }); // Send error response with the error message
        } else {
            res.status(400).json({ message: 'Failed to create category', success: false }); // Send generic error response if the error is not an instance of Error
        }       
    }
};

//get all categories
export const getAllCategoriesController = async (req: Request, res: Response) => {
    try {
        const categories = await getAllCategoriesService(); // Call the service function to get all categories
        res.status(200).json({ message: 'Categories retrieved successfully', success: true, data: categories }); // Send success response with the retrieved categories data
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to retrieve categories'; // Get error message from the error object
        const statusCode = error instanceof Error ? 400 :500; // Set status code based on the type of error
        res.status(statusCode).json({message, success: false }); // Send error response with the error message and status code  

    }
};  

//get category by id
export const getCategoryByIdController = async(req:Request, res: Response)=>
{
    try{
        const {id} = req.params; // Get category ID from request parameters
        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: 'Invalid category ID', success: false }); // Send error response if the category ID is invalid
        }
        const category = await getCategoryByIdService(id); // Call the service function to get the category by ID

        
        res.status(200).json({ message: 'Category retrieved successfully', success: true, data: category }); // Send success response with the retrieved category data
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to retrieve category'; // Get error message from the error object
        const statusCode = error instanceof Error ? 404 :500; // Set status code based on the type of error
        res.status(statusCode).json({message, success: false }); // Send error response with the error message and status code  
    }
};

//update a category 
export const updateCategoryController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Get category ID from request parameters
        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: 'Invalid category ID', success: false }); // Send error response if the category ID is invalid
        }
        const { name, description } = req.body; // Get updated category name and description from request body
        const updatedCategory = await updateCategoryService(id, name, description); // Call the service function to update the category
        res.status(200).json({ message: 'Category updated successfully', success: true, data: updatedCategory }); // Send success response with the updated category data
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update category'; // Get error message from the error object
        const statusCode = error instanceof Error ? 400 :500; // Set status code based on the type of error
        res.status(statusCode).json({message, success: false }); // Send error response with the error message and status code  
    }
};

//delete a category
export const deleteCategoryController = async (req: Request, res: Response) => {   
    try{
        const{id} = req.params; // Get category ID from request parameters
        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: 'Invalid category ID', success: false }); // Send error response if the category ID is invalid
        }
        await deleteCategoryService(id); // Call the service function to delete the category
        res.status(200).json({ message: 'Category deleted successfully', success: true }); // Send success response indicating the category was deleted 
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete category'; // Get error message from the error object
        const statusCode = error instanceof Error ? 400 :500; // Set status code based on the type of error
        res.status(statusCode).json({message, success: false }); // Send error response with the error message and status code  
    }
};
