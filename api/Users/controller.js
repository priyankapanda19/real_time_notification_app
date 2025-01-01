const userService = require("./service");

const createUser = async (req) => {
    try {
        const userData = req.body;
        const newUser = await userService.createUser(userData);

        return {
            message: "User created successfully",
            data: newUser,
        };
    } catch (error) {
        console.error("Error creating user:", error.message);
        throw new Error("Failed to create user.");
    }
};

const login = async (req) => {
    try {
        const { username, password } = req.body;
        const loginData = await userService.loginUser(username, password);

        return {
            message: "Login successful",
            data: loginData,
        };
    } catch (error) {
        console.error("Login error:", error.message);
        throw error;
    }
};

const getUserById = async (req) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);

        if (!user) {
            throw new Error("User not found.");
        }

        return {
            message: "User fetched successfully",
            data: user,
        };
    } catch (error) {
        console.error("Error fetching user:", error.message);
        throw new Error("Failed to fetch user.");
    }
};

const updateUser = async (req) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedUser = await userService.updateUser(id, updateData);

        if (!updatedUser) {
            throw new Error("User not found.");
        }

        return {
            message: "User updated successfully",
            data: updatedUser,
        };
    } catch (error) {
        console.error("Error updating user:", error.message);
        throw new Error("Failed to update user.");
    }
};

const deleteUser = async (req) => {
    try {
        const { id } = req.params;
        const deletedUser = await userService.deleteUser(id);

        if (!deletedUser) {
            throw new Error("User not found.");
        }

        return {
            message: "User deleted successfully",
            data: null,
        };
    } catch (error) {
        console.error("Error deleting user:", error.message);
        throw new Error("Failed to delete user.");
    }
};

module.exports = {
    createUser,
    login,
    getUserById,
    updateUser,
    deleteUser,
};
