import User from "../models/users/users.model.js";

//get single user 
export const getUserById = async (id: string) => {
    const user = await User.findById(id);
    if(!user)
        {
            throw new Error('User not found');
        }
        return user;
};

//get all users 
export const getAllUsers = async () =>
{
    return await User.find({});
};


//update user by profile
export const updateUser = async (id: string, updateData: Omit<Partial<typeof User>, 'password'>) => {
    const updatedUser = await User.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true } 
    );

    if (!updatedUser) {
        throw new Error('User not found');
    }
    return updatedUser;
};


//delete user by id
export const deleteUser = async (id: string) => {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
        throw new Error('User not found');
    }
    return deletedUser;

};
