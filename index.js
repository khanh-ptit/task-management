const express = require("express")
const app = express()
require("dotenv").config()
const port = process.env.PORT
const database = require("./config/database")
database.connect()
var cors = require("cors")

// Nếu sau này lỗi thì install body-parse (nhớ lên web đọc doc trên npm)
app.use(express.json());
app.use(cors())

const route = require("./api/v1/routes/index.route")
route(app)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})