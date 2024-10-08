const express = require("express")
const app = express()
require("dotenv").config()
const port = process.env.PORT
const database = require("./config/database")
database.connect()
const cors = require("cors")
const cookieParser = require("cookie-parser")

// Nếu sau này lỗi thì install body-parse (nhớ lên web đọc doc trên npm)
app.use(express.json());
app.use(cors()) // Hạn chế tên miền truy cập vào api (lên đọc doc nếu cần)
app.use(cookieParser())

const route = require("./api/v1/routes/index.route")
route(app)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})