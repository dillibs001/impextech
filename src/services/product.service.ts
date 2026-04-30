import Product from "../models/product/product.model.js";

 export interface IProductData{
    name:string;
    description:string;
    price:number;
    category:string;
    stock:number;
    image_url:string;
    condition: string;
    user_id:string;
}
export const createProduct = async(productData:IProductData) =>
    {
        
        const existingProduct = await Product.findOne({ name: productData.name });// Check if a product with the same name already exists
        if (existingProduct) {
            throw new Error('Product with this name already exists');
        }
        // Create a new product instance and save it to the database
        const product = new Product(productData);
        return await product.save();
    }

