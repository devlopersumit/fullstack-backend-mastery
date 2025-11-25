const validator = require('validator');

//Signup Validation
const validateSignupData = (req, res) => {
    const {username, email, password} = req.body;
    try {
        //Username Validation
        if(!username) throw new Error('USername is required');
        if(username<3 || username>10) throw new Error('Username must be between 3 to 10 characters');

        //Email Validation
        if(!email) throw new Error('Email is Required');
        if(!validator.isEmail(email)) throw new Error('Email is not valid');

        //Password validation
        if(!password) throw new Error('Password is required');
        if(!validator.isStrongPassword(password)) throw new Error('Password must be strong');
    } catch (error) {
        console.log(error.message);
    }
};


//Login Validation
const validateLoginData = (req, res) => {
    const {email, password} = req.body;
    try {
        //Email Validation
        if(!email) throw new Error('Email is Required');
        if(!validator.isEmail(email)) throw new Error('Email is not valid');

        //Password validation
        if(!password) throw new Error('Password is required');
        if(!validator.isStrongPassword(password)) throw new Error('Password must be strong');
        
    } catch (error) {
        console.log(error.message)
    }
};

module.exports = {
    validateSignupData,
    validateLoginData
};
