
const jwt = require("jsonwebtoken")


const userModel = require("../models/user.model")

async function identifyUser(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            message: "Token not provided"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        
        const user = await userModel.findById(decoded.id)

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            })
        }

        req.user = user   // ✅ FULL USER OBJECT

        next()

    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized access"
        })
    }
}

module.exports = identifyUser