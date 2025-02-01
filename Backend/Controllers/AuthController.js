const bcrypt = require('bcrypt');
const UserModel = require("../Models/User");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signup = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        console.log(req.body);
        const user = await UserModel.findOne({ email });
        console.log("Line 11", user);

        if (user) {
            return res.status(409).json({ message: 'User is already exist, you can login', success: false });
        }
        const userModel = new UserModel({ firstname, lastname, email, password });
        console.log(userModel)
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            });

    } catch (err) {
        console.error('Error during signup:', err.message);
        res.status(500).json({
            message: "Internal server error",
            error: err.message, // Include error details for debugging
            success: false
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Finding  user by email
        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(403)
                .json({ message: 'Auth failed wrong email', success: false });
        }

        // Checking if the password is correct
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: 'Auth failed wrong password', success: false });
        }

        // Generating JWT token with user role
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        // Sending token and user role to the client
        res.status(200)
            .json({
                message: "Login success",
                success: true,
                jwtToken,
                role: user.role,
                email,
                name: user.firstname
            });

    } catch (err) {
        console.log(err);
        res.status(500)
            .json({
                message: "Internal server error",
                success: false
            })
    }
}
module.exports = {
    signup, login
}