import mongoose, { type InferSchemaType, model } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Category name is required"], unique: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

type ICategory = InferSchemaType<typeof categorySchema>;

const Category = model<ICategory>("Category", categorySchema);

export default Category;