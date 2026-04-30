import type {Request, Response} from "express";
import  {createProduct as createProductService, type IProductData} from "../services/product.service.js";

export const createProductController = async (req: Request, res: Response) => {
    try {
        const adminId = (req as any ).auth?.id; // Assuming the admin's ID is stored in the JWT token
        const productData: IProductData =
        {...req.body,
            user_id:adminId
        }; // Combine request body with admin ID

        const newProduct = await createProductService(productData); // pass the merged data to the service 

        res.status(201).json({message:  'Gadget created successfully', success: true, data: newProduct});
} catch (error) {
        res.status(400).json({
            message: (error as Error).message || "Failed to add Product", success: false,});
        }
    };

    