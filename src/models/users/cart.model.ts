import mongoose, { type InferSchemaType, model } from "mongoose";

//cart item schema
const cartItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1, }},
  {_id: false}
);






// Define the Cart schema with user reference and items array
const cartSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

type ICart = InferSchemaType<typeof cartSchema>; // Infer the TypeScript type from the Mongoose schema

const Cart = model<ICart>("Cart", cartSchema);// Create a Mongoose model for the Cart schema and export it

export default Cart;