const jwt = require('jsonwebtoken')
const crypto = require('crypto')

function generateRefreshToken(id) {
    return jwt.sign({
        id
    }, process.env.JWT_REFRESH_TOKEN, {expiresIn: '7d'})
}

function generateAccessToken(id) {
    return jwt.sign({
        id
    }, process.env.JWT_ACCESS_TOKEN, {expiresIn: "1m"})
}

function genreateEmailVerificationToken(){
    return crypto.randomBytes(32).toString('hex')
}

module.exports = {
    generateRefreshToken,
    generateAccessToken,
    genreateEmailVerificationToken
}