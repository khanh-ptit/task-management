module.exports.register = (req, res, next) => {
    if (!req.body.fullName) {
        return res.json({
            code: 400,
            message: "Vui lòng nhập đầy đủ họ tên!"
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