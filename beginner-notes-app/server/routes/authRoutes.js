const express = require('express');
const { userSignup, userLogin, userLogout } = require('../controllers/authController');

const authRouter = express.Router();

//auth Routes
authRouter.post('/signup', userSignup);
authRouter.post('/login', userLogin);
authRouter.get('/logout', userLogout);

module.exports = authRouter;