const JWT = require("jsonwebtoken")
require("dotenv").config()

module.exports = async(req, res, next) => {
    try {
        //1. deconstruct header
        const jwt = req.header("token")

        //2. check if there is jwt and if it is valid
        if(!jwt){
            return res.status(403).json("Not authorized")
        }

        const payload = JWT.verify(jwt, process.env.jwtSecret)
        
        //3. match user
        req.user = payload.user

        next();

    } catch (error) {
        console.error(error.message)
        return res.status(403).json("Not authorized")
    }
}