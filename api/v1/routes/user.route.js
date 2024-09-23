const express = require("express")
const router = express.Router()

const controller = require("../controllers/user.controller")
const validate = require("../validates/user.validate")
const authMiddleware = require("../middlewares/auth.middleware")

router.post("/register", validate.register, controller.register)

router.post("/login", validate.login, controller.login)

router.post("/password/forgot", validate.forgotPassword, controller.forgotPassword)

router.post("/password/otp", validate.otpPassword, controller.otpPassword)

router.get("/logout", controller.logout)

router.post("/password/reset", validate.resetPassword, controller.resetPassword)

router.get("/info", authMiddleware.requireAuth, controller.info)

module.exports = router