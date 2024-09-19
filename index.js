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
    // console.log(tasks)
    res.json(tasks)
})

app.get("/tasks/detail/:id", async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            deleted: false
        })
        res.json(task)
    } catch (error) {
        res.json("Không tồn tại bản ghi")
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})