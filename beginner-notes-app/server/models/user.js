const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: [3, 'Username must be at least 3 characters'],
        maxLength: [10, 'Username cannot exceed 10 characters']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: 'Please enter a valid email address'
        }
    },
    password: {
        type: String,
        validate: {
            validator: (value) => validator.isStrongPassword(value),
            message: 'Password must be strong (min 8 chars, uppercase, lowercase, number, symbol)'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);