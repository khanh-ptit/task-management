module.exports.register = (req, res, next) => {
    if (!req.body.fullName) {
        return res.json({
            code: 400,
            message: "Vui lòng nhập đầy đủ họ tên!"
        })
    }

    if (!req.body.email) {
        res.json({
            code: 400,
            message: "Vui lòng nhập email"
        })
    }

    if (!req.body.password) {
        return res.json({
            code: 400,
            message: "Vui lòng nhập mật khẩu!"
        })
    }

    if (!req.body.confirmPassword) {
        return res.json({
            code: 400,
            message: "Vui lòng xác nhận mật khẩu!"
        })
    }

    if (req.body.password != req.body.confirmPassword) {
        return res.json({
            code: 400,
            message: "Mật khẩu không trùng khớp!"
        })
    }
    next()
}

module.exports.login = (req, res, next) => {
    if (!req.body.email) {
        return res.json({
            code: 400,
            message: "Vui lòng nhập email!"
        })
    }
    if (!req.body.password) {
        return res.json({
            code: 400,
            message: "Vui lòng nhập mật khẩu!"
        })
    }
    next()
}

module.exports.forgotPassword = (req, res, next) => {
    if (!req.body.email) {
        return res.json({
            code: 400,
            message: "Vui lòng nhập email!"
        })
    }
    next()
}

module.exports.otpPassword = (req, res, next) => {
    if (!req.body.otp) {
        return res.json({
            code: 400,
            message: "Vui lòng nhập OTP!"
        })
    }
    const otp = req.body.otp
    if (otp.length != 8) {
        return res.json({
            code: 400,
            message: "OTP phải có 8 ký tự!"
        })
    }

    for (let char of otp) {
        if (char < '0' || char > '9') {
            return res.json({
                code: 400,
                message: "OTP chỉ được phép bao gồm chữ số, không chứa các ký tự!"
            })
        }
    }
    next()
}

module.exports.resetPassword = (req, res, next) => {
    if (!req.body.password) {
        return res.json({
            code: 400,
            message: "Vui lòng nhập mật khẩu!"
        })
    }

    if (!req.body.confirmPassword) {
        return res.json({
            code: 400,
            message: "Vui lòng xác nhận mật khẩu!"
        })
    }
}