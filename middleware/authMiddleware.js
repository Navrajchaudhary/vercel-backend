const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

async function isAuthenticated(req, res, next) {

    try {

        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token missing or invalid formated."
            })
        }

        const token = authHeader.split(" ")[1]

        if(!token){
            return res.status(400).json({
                success: false,
                message: "Token not found"
            })
        }

        try {

            const decode = jwt.verify(token, process.env.JWT_ACCESS_TOKEN)

            if (!decode || !decode.id) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token payload"
                })
            }

            const user = await userModel.findById(decode.id).select("-password")

            if(!user){
                return res.status(401).json({
                    success: fasle,
                    message: "User no longer exists"
                })
            }

            if(!user.isVerified){
                return res.status(403).json({
                    success: false,
                    message: "Please verify your email first to access this resource"
                })
            }

            req.user = user

            next()

        } catch (err) {

            if (err?.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Access token expired"
                })
            }

            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Somthing went wrong. Please try again!"
        })
    }
}

module.exports = {
    isAuthenticated
}