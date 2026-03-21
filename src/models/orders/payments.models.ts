import mongoose, { type InferSchemaType, model } from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    payment_method: { type: String, enum: ["Credit Card", "PayPal", "Bank Transfer"], required: true },
    payment_status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
    transaction_id: { type: String, unique: true },
  },
  { timestamps: true }
);// This defines a Mongoose schema for the Payment model. It includes fields for order_id (referencing the Order model), payment_method (with allowed values), payment_status (with allowed values and a default), and transaction_id (which must be unique). The timestamps option automatically adds createdAt and updatedAt fields to the schema.

type IPayment = InferSchemaType<typeof paymentSchema>;// This will create a TypeScript type based on the paymentSchema, allowing for type safety when working with Payment documents in your code.

// const Payment = model<IPayment>("Payment", paymentSchema);// This creates a Mongoose model named "Payment" using the paymentSchema. The model provides an interface for interacting with the "payments" collection in the MongoDB database, allowing you to create, read, update, and delete payment documents.

const Payment = model<IPayment>("Payment", paymentSchema);// This creates a Mongoose model named "Payment" using the paymentSchema. The model provides an interface for interacting with the "payments" collection in the MongoDB database, allowing you to create, read, update, and delete payment documents. 

export default Payment;// This exports the Payment model so that it can be imported and used in other parts of the application, such as in controllers or services that handle payment-related logic.