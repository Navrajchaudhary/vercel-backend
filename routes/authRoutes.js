const express = require('express')
const authControllers = require('../controllers/authControllers')
const { isAuthenticated } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/register', authControllers.register)
router.post('/verify-email/:token', authControllers.verifyEmail)
router.post('/resend/:email', authControllers.resendEmailVerification)
router.post('/login', authControllers.login)
router.get('/profile', isAuthenticated, authControllers.profile)
router.post('/refresh-token', authControllers.refreshAccessToken)
router.get('/logout', authControllers.logout)

module.exports = router