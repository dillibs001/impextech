import type {Request, Response} from "express";
import  
{
        createProduct as createProductService, 
        getAllProducts as getAllProductsService,
        getProductById as getProductByIdService,
        updateProduct as updateProductService,
        deleteProduct as deleteProductService,

        type IProductData
    } from "../services/product.service.js";

// const errorHandlerforId = (productId: string | undefined, res:Response) => {
//     if (!productId || Array.isArray(productId)) {
//        res.status(400).json({ message: 'Invalid product ID' });
//     }
// };// Helper function to handle errors related to product ID validation

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

export const getAllProductsController = async (req: Request, res: Response) => {
    try {
        const products = await getAllProductsService();// Call the service function to get all products
        res.status(200).json({ message: 'Products retrieved successfully', success: true, data: products });
    } catch (error:any) {
        res.status(500).json({ message: error.message ||'Failed to retrieve products', success: false });
    }
};

export const getProductByIdController = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id; // Get the product ID from the request parameters
        if (!productId || Array.isArray(productId)) 
        {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
          
        
        const product = await getProductByIdService(productId); // Call the service function to get the product by ID
        

        if (!product) {
            return res.status(404).json({ message: 'Product not found', success: false });
        }
        

        res.status(200).json({ message: 'Product retrieved successfully', success: true, data: product });
    } catch (error:any) {
        res.status(500).json({ message: error.message || 'Failed to retrieve product', success: false });
    }
};

export const updateProductController = async (req: Request, res: Response) => {
    try{

        
        const productId = req.params.id; // Get the product ID from the request parameters
        
        if (!productId || Array.isArray(productId)) 
            {
                return res.status(400).json({ message: 'Invalid product ID' });
            }
        
        const updateData: Partial<IProductData> = req.body; // Get the updated product data from the request body
        
        const updatedProduct = await updateProductService(productId, updateData); // Call the service function to update the product
         
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found', success: false });
        }
       res.status(200).json({ message: 'Product updated successfully', success: true, data: updatedProduct }); 
    }catch (error:any) {
        res.status(500).json({ message: error.message || 'Failed to update product', success: false });
    }
};

export const deleteProductController = async(req:Request, res:Response) => {
    try {
        const productId = req.params.id; // Get the product ID from the request parameters
        
        if (!productId || Array.isArray(productId)) {
            return res.status(400).json({success: false,  message: 'Invalid product ID'});
            
        }
        await deleteProductService(productId); // Call the service function to delete the product
        res.status(200).json({ success : true, message: 'Product deleted successfully' });
    } catch (error:any) {
        res.status(500).json({ success: false, message: error.message || 'Failed to delete product' });

    }
}




