const express = require("express")

require("../database/models/ref");

const user_controller = express.Router()


user_controller.get("/info", (req, res) => {
    res.json({
        info:"success"
    })
})


module.exports = user_controller