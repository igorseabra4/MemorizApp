require('dotenv').config()
const db = require('../../../database/db')()
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { MAX_TOKEN_AGE_SECONDS } = require('../../../routes/collections/services/constants')

module.exports = async (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    if (!token)
        return res.sendStatus(StatusCodes.UNAUTHORIZED)

    try {
        var user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    } catch (err) {
        return res.status(StatusCodes.FORBIDDEN).json({ error: err })
    }

    try {
        var [rows] = await db.query('SELECT ID, USERNAME FROM USER WHERE ID = ?', [user.id])
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
    }

    if (rows.length == 0)
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' })

    const dateDiffSecs = (Date.now() - new Date(user.issuedAt * 1000))
    if (dateDiffSecs >= MAX_TOKEN_AGE_SECONDS * 1000)
        return res.status(StatusCodes.FORBIDDEN).json({ error: 'Token expired' })

    req.userId = rows[0].ID

    return next()
}