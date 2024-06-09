const Sequelize = require("sequelize")
require("dotenv").config()


let  connection

let opction = {
    host: "localhost",
    dialect: "mysql",
    timezone: "+01:00",
    logging: false

}







connection  = new Sequelize(process.env.baseDedados, process.env.user, process.env.senha, opction )

module.exports = connection