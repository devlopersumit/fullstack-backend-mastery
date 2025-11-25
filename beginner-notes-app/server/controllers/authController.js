const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

//signup
const signup = async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({message:'User already exist'});
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const token = jwt.sign({username,email}, process.env.SECRET_KEY, {expiresIn:'7d'});

        const newUser = await User.create({
            username:username.trim(),
            email:email.toLowerCase().trim(),
            password:hashPassword
        });

        res.status(201).json({
            message:'User Created Successfully',
            user:{username, email},
            token:token
        });
    } catch (error) {
        res.status(500).json({message:'Something went wrong' || error.message})
    }
}
