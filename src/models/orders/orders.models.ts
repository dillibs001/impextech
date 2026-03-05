import mongoose, { type InferSchemaType, model } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    total_price: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
    shipping_address: { type: String, required: true },
    payment_method: { type: String, enum: ["Credit Card", "PayPal", "Bank Transfer"], required: true },
  },
  { timestamps: true }
);

type IOrder = InferSchemaType<typeof orderSchema>;

const Order = model<IOrder>("Order", orderSchema);

export default Order;