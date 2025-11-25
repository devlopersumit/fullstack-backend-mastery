const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { validateSignupData, validateLoginData } = require('../utils/validation');

//signup
const userSignup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // validate input (pass req.body to validator)
        validateSignupData(req.body);
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashPassword
        });

        // sign token with created user's id
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.SECRET_KEY, { expiresIn: '7d' });

        // cookie configuration
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        };

        res.cookie('token', token, cookieOptions);

        res.status(201).json({
            message: 'User Created Successfully',
            user: { username: newUser.username, email: newUser.email }
        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Something went wrong' });
    }
};

//Login

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        validateLoginData(req.body);
        const user = await User.findOne({ email });
        if (!email) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '7d' });

        // cookie configuration
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        };

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: { id: user._id, email: user.email, username: user.username }
        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Login error' });
    }
};

module.exports = {
    userSignup,
    userLogin
};
