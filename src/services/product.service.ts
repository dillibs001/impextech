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

export const getAllProducts = async () => {
    return await Product.find({});
};//fetch all products from the database and return them as an array of product objects

export const getProductById = async (id: string) => {
    return await Product.findById(id);

};

//fetch a single product by its ID from the database and return it as a product object. If the product is not found, it will return null.
export const updateProduct = async (id: string, productData: Partial<IProductData>) => {
    const product = await Product.findByIdAndUpdate(
        id, 
            productData, 
             { new: true }); // Update a product by its ID with the provided data and return the updated product  
                return product;
};

//delete a product by id 
export const deleteProduct = async (id: string) => {
    await Product.findByIdAndDelete(id); // Delete a product by its ID from the database
    return Product;
};