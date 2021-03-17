const { Sequelize } = require('sequelize');
const userSequelize = require("../databases/userSequelize")

const userModel = userSequelize.define('user', {
    user_id: {
        type: Sequelize.UUIDV4
    },
    user_name: {
        type: Sequelize.STRING
    },
    user_email: {
        type: Sequelize.STRING
    },
    user_password: {
        type: Sequelize.STRING
    }
})

module.exports = userModel