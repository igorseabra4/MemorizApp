require('dotenv').config()
const db = require('../../../database/db')()
const bcrypt = require('bcrypt')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')

module.exports = async (req, res) => {
    const { username, password } = req.body
    try {
        var [rows] = await db.query('SELECT ID, USERNAME, PASSWORD FROM USER WHERE USERNAME = ?', username)
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
    }

    if (rows.length == 0)
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Usuário não encontrado' })

    try {
        var match = await bcrypt.compare(password, rows[0].PASSWORD)
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err })
    }

    if (!match)
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Senha incorreta' })

    const user = {
        id: rows[0].ID,
        username: rows[0].USERNAME,
        issuedAt: Math.floor(Date.now() / 1000)
    }

    return res.json({
        accessToken: jwt.sign(user, process.env.ACCESS_TOKEN_SECRET),
        issuedAt: user.issuedAt
    })
}