import mongoose, { type InferSchemaType, model } from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

type IWishlist = InferSchemaType<typeof wishlistSchema>;

const Wishlist = model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;