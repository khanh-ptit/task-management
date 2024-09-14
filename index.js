const express = require("express")
const app = express()
require("dotenv").config()
const port = process.env.PORT
const database = require("./config/database")
database.connect()

const Task = require("./models/task.model")

app.get('/tasks', async (req, res) => {
    const tasks = await Task.find({
        deleted: false
    })
    console.log(tasks)
    res.send("OK")
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})