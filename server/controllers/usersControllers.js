import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../models/UsersSchema.js";

dotenv.config()

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return sendRes(res, 400, false, "All fields are required");
        }

        if (password.length < 8) {
            return sendRes(res, 400, false, "Password must be at least 8 characters long");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendRes(res, 400, false, "Email already exists");
        }

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        const month = monthNames[now.getMonth()];
        const year = now.getFullYear();
        
        const formattedDate = `${day}-${month}-${year}`;

        const newUser = new User({
            username,
            email,
            password, 
            isAdmin: false,
            date: formattedDate
        });

        const savedUser = await newUser.save();

        sendRes(res, 200, true, "User registered successfully", savedUser);

    } catch (error) {
        sendRes(res, 500, false, "Internal server error");
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendRes(res, 400, false, "Email and password are required");
        }

        if (password.length < 8) {
            return sendRes(res, 400, false, "Password must be at least 8 characters long");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return sendRes(res, 404, false, "Invalid credentials");
        }

        if (user.password !== password) {
            return sendRes(res, 401, false, "Invalid credentials");
        }

        const token = jwt.sign(
            { 
                _id: user._id, 
                email: user.email, 
                username: user.username,
                isAdmin: user.isAdmin 
            }, 
            process.env.JWT_SECRET,
            { expiresIn: "7d" } 
        );

        const userData = user.toObject();
        delete userData.password;

        sendRes(res, 200, true, "Login successful", { user: userData, token });

    } catch (error) {
        sendRes(res, 500, false, "Internal server error");
    }
}

const checkToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return sendRes(res, 400, false, "Token is required");
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return sendRes(res, 401, false, "Token expired");
                }
                return sendRes(res, 401, false, "Invalid token");
            }

            const user = await User.findById(decoded._id).select("-password");
            
            if (!user) {
                return sendRes(res, 404, false, "User no longer exists");
            }

            sendRes(res, 200, true, "Token is valid", user);
        });

    } catch (error) {
        sendRes(res, 500, false, "Internal server error");
    }
}

const getSingleUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("username email date _id isAdmin");

        if (!user) {
            return sendRes(res, 404, false, "User not found");
        }

        sendRes(res, 200, true, "User found", user);
    } catch (error) {
        sendRes(res, 500, false, "Internal server error");
    }
}

const getAllUsers = async (req, res) => {
    try {
        const requester = await User.findById(req.user._id);

        if (!requester || !requester.isAdmin) {
            return sendRes(res, 403, false, "Access denied. Only admins can hit this API");
        }

        const users = await User.find().select("username email date _id isAdmin");
        sendRes(res, 200, true, "All users fetched", users);
    } catch (error) {
        sendRes(res, 500, false, "Internal server error");
    }
}

export {
    signup,
    login,
    checkToken,
    getSingleUser,
    getAllUsers,
}