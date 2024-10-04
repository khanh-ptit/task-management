const User = require("../models/user.model")

module.exports.requireAuth = async (req, res, next) => {
    if (req.cookies.token) {
        const token = req.cookies.token
        // console.log(token)

        const user = await User.findOne({
            token: token,
            deleted: false
        }).select("-password")

        if (!user) {
            return res.json({
                code: 400,
                message: "Token không hợp lệ"
            })
        }

        req.user = user

        next()
    } else {
        return res.json({
            code: 400,
            message: "Vui lòng gửi kèm token!"
        })
    }

}