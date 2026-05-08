import Cart from "../models/users/cart.model.js";
import Product from "../models/product/product.model.js";


//get cart by user id
export const getCartByUserId = async (userId: string) => {
    // Find the cart for the user, populating the product details in the items array
  let cart = await Cart.findOne({ user_id: userId }).populate("items.product_id");
  // If no cart exists for the user, create a new one
  if (!cart) {
    cart = await Cart.create({ user_id: userId, items: [] });
  } 
    return cart;
};

//add item to cart
export const addItemToCart = async (userId: string, productId: string, quantity: number) => {
    // Find the user's cart
     let cart = await Cart.findOne({ user_id: userId });
     // If no cart exists, create a new one
 //If no cart exists, build one with the item already inside!
    if (!cart) {
        cart = await Cart.create({
            user_id: userId,
            items: [{ product_id: productId, quantity }]
        });
        return cart;
    }
    //if product already exists in cart, proceed with logic
    const existingItemIndex = cart.items!.findIndex(item => item.product_id.toString() === productId);
    if(existingItemIndex >=0 )
    {
        cart.items![existingItemIndex]!.quantity += quantity; // Update quantity if item already exists
    }
    else
    {
        cart.items.push({ product_id: productId, quantity }); // Add new item to cart
    }

//update overall total price of the cart by iterating through the items and calculating the total price based on the quantity and price of each item
    


    await cart.save(); // Save the updated cart
    return cart;    

};




export const addItemToCartService = async (userId: string, productId: string, quantity: number= 1) => {
//fetch the product from the db to get teh actual price of the product and check if the product exists in the db
const product = await Product.findById(productId);
if(!product)
{
    throw new Error('Product not found');
}
 //calaculate the cost of this addition 
 const costOfAddition = product.price * quantity;

 //find user's cart
 let cart = await Cart.findOne({ user_id: userId });
 //if no cart exists, create a new one with the item already inside
 if(!cart)
 {
    cart = new Cart({
        user_id: userId,
        items: [{ product_id: productId, quantity }],
        totalPrice: costOfAddition
    });
    await cart.save();
    return cart;
 }
 //if cart exists, check if the item already exists in the cart
 const existingItemIndex = cart.items!.findIndex((item) => item.product_id.toString() === productId);
 if(existingItemIndex >=0 )
 {
    //item already exists in the cart, update the quantity and total price
    cart.items![existingItemIndex]!.quantity += quantity;
 }
 else
 {
    //item does not exist in the cart, add the item and update the total price
    cart.items.push({ product_id: productId, quantity });
 }

   //update the total price of the cart
    cart.totalPrice = (cart.totalPrice || 0) + costOfAddition;
    //save the updated cart
    await cart.save();
    return cart;
};





//remove item from cart
export const removeItemFromCart = async (userId: string, productId: string) => {
   // mongoose pull operator to  remove the item from the cart
   const cart = await Cart.findOneAndUpdate(
    { user_id: userId },
    { $pull: { items: { product_id: productId } } },
    { new: true }
   );
   //
   if(!cart)
   {
    throw new Error('Cart not found');
   }
   return cart; 
 
}