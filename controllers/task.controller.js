const Task = require("../models/task.model")

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status
    }

    // Sort
    let sort = {}
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey
        const sortValue = req.query.sortValue
        sort[sortKey] = sortValue
        // sort.req.query.sortKey = req.query.sortValue
    } 
    // End sort
    const tasks = await Task.find(find).sort(sort)
    res.json(tasks)
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id
        const task = await Task.findOne({
            _id: id,
            deleted: false
        })
        res.json(task)
    } catch (error) {
        res.json("Không tồn tại bản ghi")
    }
}