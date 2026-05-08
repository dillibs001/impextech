import Category from "../models/product/categories.model.js";

//create category
export const createCategoryService = async (name: string, description?: string) => {
    //check if category with the same name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        throw new Error('Category with this name already exists');
    }       

    //create a new category
    const category = new Category({ name, description });
    await category.save();
    return category;
};

//get all categories
export const getAllCategoriesService = async () => {
    //sort alphabetically by name
    const categories = await Category.find().sort({ name: 1 });
    return categories;
};

//get category by id
export const getCategoryByIdService = async (id: string) => {
    const category = await Category.findById(id);
    if (!category) {
        throw new Error('Category not found');
    }
    return category;
};


    //update category
    export const updateCategoryService = async (id: string, name?: string, description?: string) => {
    // 1. If they are changing the name, ensure no OTHER category already has it
    if (name) {
        const existingCategory = await Category.findOne({ name });
        if (existingCategory && existingCategory._id.toString() !== id) {
            throw new Error('Category with this name already exists');
        } // If another category with the same name exists and it's not the current category, throw an error
    }

    // 2. Perform the atomic update (1 trip to the database)
    const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { $set: { name, description } },
        { new: true, runValidators: true } // Returns the updated document and checks schema rules
    );

    if (!updatedCategory) {
        throw new Error('Category not found');
    }

    return updatedCategory;
};

//Delete Category
export const deleteCategoryService = async (id: string) => {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
        throw new Error('Category not found');
    }
    
    return deletedCategory;
};  


