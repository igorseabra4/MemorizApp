require('dotenv').config()
const mysql = require("mysql2/promise")
var pool

module.exports = function getPool() {
  if (pool)
    return pool
  const config = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  }
  return mysql.createPool(config)
}
