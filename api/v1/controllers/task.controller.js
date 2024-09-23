const Task = require("../models/task.model")
const paginationHelper = require("../../../helpers/pagination")
const searchHelper = require("../../../helpers/search")

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
        $or: [{
                createdBy: req.user.id
            },
            {
                listUser: {
                    $in: [req.user.id]
                }
            }
        ]
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

    // Pagination
    let objectPagination = paginationHelper(req.query)
    // End pagination

    // Search
    const objectSearch = searchHelper(req.query)
    if (req.query.keyword) {
        find.title = objectSearch.regex
    }
    // console.log(objectSearch)
    // End search

    const tasks = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitedItem)
        .skip(objectPagination.skip)
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

// [PATCH] /api/v1/tasks/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id
        const listStatus = ['initial', 'doing', 'finish', 'pending', 'notFinish'] // Dùng collection cũng được
        const status = req.body.status
        if (!listStatus.includes(status)) {
            res.json({
                code: 404,
                message: "Trạng thái không hợp lệ!"
            })
            return
        }
        console.log(id, status)
        await Task.updateOne({
            _id: id
        }, {
            status: status
        })
        res.json({
            code: 200,
            message: "Cập nhật trạng thái công!"
        })
    } catch (error) {
        res.json({
            code: 404,
            message: "Không tồn tại!"
        })
    }
}

// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const ids = req.body.ids;
        const key = req.body.key;
        const value = req.body.value;

        let update = {};
        let successMessage = "";

        // Handle different cases based on the key
        switch (key) {
            case "status":
                update = {
                    [key]: value
                }; // Dynamically set field for status update
                successMessage = `Cập nhật trạng thái thành công cho ${ids.length} task!`;
                break;

            case "delete":
                update = {
                    deleted: true,
                    deletedAt: new Date()
                }; // Mark tasks as deleted
                successMessage = `Xóa ${ids.length} task thành công!`;
                break;

            default:
                return res.status(400).json({
                    code: 400,
                    message: "Trường bạn muốn cập nhật không hợp lệ"
                });
        }

        // Perform the update
        await Task.updateMany({
            _id: {
                $in: ids
            }
        }, update);

        // Send a success response
        return res.json({
            code: 200,
            message: successMessage
        });

    } catch (error) {
        // Handle errors
        console.error(error); // Log the error for debugging
        return res.status(500).json({
            code: 500,
            message: "Lỗi khi cập nhật task!"
        });
    }
};

// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
    try {
        // console.log(req.body)
        req.body.createdBy = req.user.id
        const task = new Task(req.body)
        const data = await task.save()
        res.json({
            code: 200,
            message: "Thêm task thành công",
            data: data
        })
    } catch (error) {
        return res.json({
            code: 400,
            message: "Có lỗi xảy ra!"
        })
    }

}

// [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        console.log(req.body)
        console.log(id)
        await Task.updateOne({
            _id: id
        }, req.body)
        res.json({
            code: 200,
            message: "Cập nhật thành công cho task!"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
}

// [DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id
        // console.log(id)
        await Task.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date()
        })
        res.json({
            code: 200,
            message: "Xóa thành công task"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi"
        })
    }
}