const validator = require('validator');

const validateSignupData = (data = {}) => {
    const { username, email, password } = data;

    if (!username || typeof username !== 'string') throw new Error('Username is required');
    const uname = username.trim();
    if (uname.length < 3 || uname.length > 10) throw new Error('Username must be between 3 to 10 characters');

    if (!email || typeof email !== 'string') throw new Error('Email is required');
    const em = email.trim().toLowerCase();
    if (!validator.isEmail(em)) throw new Error('Email is not valid');

    if (!password || typeof password !== 'string') throw new Error('Password is required');
    if (!validator.isStrongPassword(password)) throw new Error('Password must be strong');

    return { username: uname, email: em, password };
};

//Login Validation
const validateLoginData = (data = {}) => {
    const { email, password } = data;

    if (!email || typeof email !== 'string') throw new Error('Email is required');
    const em = email.trim().toLowerCase();
    if (!validator.isEmail(em)) throw new Error('Email is not valid');

    if (!password || typeof password !== 'string') throw new Error('Password is required');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');

    return { email: em, password };
};

module.exports = {
    validateSignupData,
    validateLoginData
};
