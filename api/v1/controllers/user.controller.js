const User = require("../models/user.model")
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