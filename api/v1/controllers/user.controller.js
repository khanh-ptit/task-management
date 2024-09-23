const User = require("../models/user.model")
const ForgotPassword = require("../models/forgotPassword.model")
const generateHelper = require("../../../helpers/generate")
const sendMailHelper = require("../../../helpers/sendMail")
const md5 = require("md5")

// [POST] /api/v1/user/register
module.exports.register = async (req, res) => {
    req.body.password = md5(req.body.password)
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })

    if (existEmail) {
        return res.json({
            code: 400,
            message: "Email đã tồn tại!"
        })
    }

    const user = new User(req.body)
    await user.save()

    const token = user.token
    res.cookie("token", token)

    res.json({
        code: 200,
        message: "Tạo tài khoản thành công!",
        token: token
    })
}

// [POST] /api/v1/user/login
module.exports.login = async (req, res) => {
    // console.log(req.body)
    const email = req.body.email
    const password = req.body.password

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        return res.json({
            code: 400,
            message: "Email không tồn tại"
        })
    }

    if (user.password != md5(password)) {
        return res.json({
            code: 400,
            message: "Email hoặc mật khẩu không đúng!"
        })
    }

    const token = user.token
    res.cookie("token", token)
    res.send({
        code: 200,
        message: "Đăng nhập thành công!",
        token: token
    })
}

// [GET] /api/v1/user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("token")
    res.json({
        code: 200,
        message: "Đăng xuất thành công!"
    })
}

// [POST] /api/v1/user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email
    const existEmail = await User.findOne({
        email: email,
        deleted: false
    })
    if (!existEmail) {
        return res.json({
            code: 400,
            message: "Email không tồn tại không hệ thống!"
        })
    }

    const otp = generateHelper.generateRandomNumber(8)
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: new Date(Date.now() + 180 * 1000)
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    console.log(objectForgotPassword)
    await forgotPassword.save()

    // Gửi OTP
    const subject = `Mã xác thực OTP đặt lại mật khẩu`
    const html = `
        Mã OTP lấy lại mật khẩu là <b>${otp}</b>. Lưu ý không được chia sẻ mã này. Thời hạn sử dụng là 3 phút.
    `

    sendMailHelper.sendMail(email, subject, html)

    res.json({
        code: 200,
        message: "OTP đã được gửi về email của bạn"
    })
}

// [POST] /api/v1/user/password/otp
module.exports.otpPassword = async (req, res) => {
    const otp = req.body.otp
    const record = await ForgotPassword.findOne({
        email: req.body.email,
        otp: otp
    })

    if (!record) {
        return res.json({
            code: 400,
            message: "OTP không hợp lệ"
        })
    }

    const user = await User.findOne({
        email: req.body.email
    })

    res.cookie("token", user.token)
    res.json({
        code: 200,
        message: "Xác nhận OTP thành công!",
        token: user.token
    })
}

// [POST] /api/v1/user/password/reset
module.exports.resetPassword = async (req, res) => {
    const token = req.cookies.token
    if (!token) {
        return res.json({
            code: 400,
            message: "Trang web không tồn tại"
        })
    }
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword

    if (password != confirmPassword) {
        return res.json({
            code: 400,
            message: "Mật khẩu không trùng khớp"
        })
    }

    const user = await User.findOne({
        token: token
    })
    // console.log(user.password, md5(password))
    if (user.password == md5(password)) {
        return res.json({
            code: 400,
            message: "Mật khẩu mới không được trùng với mật khẩu cũ!"
        })
    }

    await User.updateOne({
        token: token
    }, {
        password: md5(password)
    })

    res.clearCookie("token")

    res.json({
        code: 200,
        message: "Cập nhật mật khẩu thành công!"
    })
}

// [GET] /api/v1/user/info
module.exports.info = async (req, res) => {
    res.json({
        code: 200,
        message: "Lấy data thành công!",
        user: req.user
    })
}

// [GET] /api/v1/user/list
module.exports.list = async (req, res) => {
    const users = await User.find({
        deleted: false
    }).select("fullName email")
    
    res.json({
        code: 200,
        message: "Thành công!",
        users: users
    })
}