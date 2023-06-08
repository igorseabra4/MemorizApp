const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()
const bcrypt = require('bcrypt')
const { BCRYPT_SALT } = require('../../collections/services/constants')

module.exports = async (req, res) => {
    const { username, password } = req.body

    try {
        var hashed = await bcrypt.hash(password, BCRYPT_SALT)
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err })
    }

    try {
        await db.query('INSERT INTO USER (USERNAME, PASSWORD, CREATED_AT, UPDATED_AT) VALUES (?, ?, NOW(), NOW())', [username, hashed])
    } catch (err) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: err.sqlMessage })
    }

    return res.status(StatusCodes.CREATED).json()
}
