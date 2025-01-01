const User = require("./index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (userData) => {
    console.log("userData", userData);
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
        ...userData,
        password: hashedPassword,
    });
    return await user.save();
};

const loginUser = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
    );

    return {
        token,
        user: {
            id: user._id,
            username: user.username,
            role: user.role,
        },
    };
};

const getUserById = async (id) => {
    return await User.findById(id).select("-password");
};

const updateUser = async (id, updateData) => {
    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select(
        "-password",
    );
};

const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};

const updateUserOnlineStatus = async (id, isOnline) => {
    return await User.findByIdAndUpdate(id, { isOnline }, { new: true });
};

module.exports = {
    createUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser,
    updateUserOnlineStatus,
};
