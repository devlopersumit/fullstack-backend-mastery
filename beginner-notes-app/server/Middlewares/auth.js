const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    const token = req.cookies.token;
    try {
        if(!token){
            return res.status(400).json({message:'Unauthorized user'});
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({message:'Invalid Token'});
    }
};

module.exports = userAuth;