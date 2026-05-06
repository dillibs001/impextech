import Cart from "../models/users/cart.model.js";

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
    await cart.save(); // Save the updated cart
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