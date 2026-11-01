const userModel = require('../models/userModel')
const tokenModel = require('../models/tokenModel')
const bcrypt = require('bcrypt')
const { generateRefreshToken, generateAccessToken, genreateEmailVerificationToken } = require('../utils/token')
const jwt = require('jsonwebtoken')
const { sendEmailVerification, welcomeMessage } = require('../service/nodemailer')


async function register(req, res) {

    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        })
    }

    try {

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists with this email.'
            })
        }

        const user = await userModel.create({
            username, email, password
        })

        const VerificationToken = genreateEmailVerificationToken()

        await tokenModel.create({
            userId: user._id,
            token: VerificationToken,
            tokenType: "EMAIL_VERIFICATION",
            expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        })

        const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${VerificationToken}`

        await sendEmailVerification(email, username, verificationUrl)

        const userResponse = user.toObject()
        delete userResponse.password

        return res.status(201).json({
            success: true,
            message: "Register successfully",
            user: userResponse,
            VerificationToken,
            verificationUrl
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong. try again!"
        })
    }
}

async function verifyEmail(req, res) {

    const { token } = req.params

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Verification token is missing. "
        })
    }

    try {
        const tokenRecord = await tokenModel.findOne({ token, tokenType: "EMAIL_VERIFICATION" })

        if (!tokenRecord) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expire verification link."
            })
        }

        await userModel.findByIdAndUpdate(tokenRecord.userId, { isVerified: true })

        const verifiedUser = await userModel.findById(tokenRecord.userId)

        if (verifiedUser) {
            await welcomeMessage(verifiedUser.email, verifiedUser.username)
        }

        await tokenModel.findByIdAndDelete(tokenRecord._id)

        return res.status(200).json({
            success: true,
            message: "Email verified successfully! You can now log in."
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Somthing went wrong. Please try again!"
        })
    }

}

async function resendEmailVerification(req, res) {

    const { email } = req.params

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email required"
        })
    }

    try {

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified. you can log in!"
            })
        }

        await tokenModel.deleteMany({ userId: user._id, tokenType: "EMAIL_VERIFICATION" })

        const verificationToken = genreateEmailVerificationToken()

        await tokenModel.create({
            userId: user._id,
            token: verificationToken,
            tokenType: "EMAIL_VERIFICATION",
            expireAt: new Date(Date.now() + 20 * 60 * 1000)
        })

        const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`

        await sendEmailVerification(email, user.username, verificationUrl)

        return res.status(200).json({
            success: true,
            message: "Email verifyLink send Successfully. check your email!",
            verificationToken,
            verificationUrl
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        })
    }
}

async function login(req, res) {

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        })
    }

    try {

        const user = await userModel.findOne({ email }).select("+password")

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "verify your email first to log in!"
            })
        }

        const passwordMatch = await user.comparePassword(password)

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const refreshToken = generateRefreshToken(user._id)
        const accessToken = generateAccessToken(user._id)

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const clientResponse = user.toObject()
        delete clientResponse.password

        return res.status(200).json({
            success: true,
            message: "LoggedIn Successfully",
            user: clientResponse,
            accessToken
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Somthing went wrong. Please try again!"
        })
    }
}

async function profile(req, res) {

    const user = req.user

    return res.status(200).json({
        success: true,
        message: "Profile fetched Successfully",
        user
    })
}

async function refreshAccessToken(req, res) {
    const token = req.cookies.refreshToken

    if (!token) {

        return res.status(401).json({
            success: false,
            message: "Refresh token missing. Please login again."
        })
    }

    try {

        const decode = jwt.verify(token, process.env.JWT_REFRESH_TOKEN)

        if (!decode || !decode.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token paylode"
            })
        }

        const user = await userModel.findById(decode.id)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        const refreshToken = generateRefreshToken(user._id)
        const newaccessToken = generateAccessToken(user._id)

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            message: "Refreshed AccessToken Successfully",
            accessToken: newaccessToken
        })

    } catch (error) {

        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Refresh token expired or invalid. Please login again."
            })
        }
        return res.status(500).json({
            success: false,
            message: error.message || "Somthing went wrong. Please try again!"
        })
    }
}

async function logout(req, res) {
    try {

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax"
        })

        return res.status(200).json({
            success: true,
            message: "Logout successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Somthing went wrong. Please try again!"
        })
    }
}

module.exports = {
    register,
    verifyEmail,
    resendEmailVerification,
    login,
    profile,
    refreshAccessToken,
    logout
}