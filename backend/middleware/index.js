const {User} = require('../models/User')
const jwt = require('jsonwebtoken')

exports.protect = async (req,res,next) =>{
    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    }
    
    if(!token){
        return res.status(401).send("Not authorized")
    }
    
    try {
        const decoded = jwt.verify(token,'abhinav')
        const user = await User.findById(decoded.userId);
        
        if(user){
            req.user = user;
            next();
        }
        

    } catch (error) {
        return res.status(401).send("Not Authorized")
    }

}