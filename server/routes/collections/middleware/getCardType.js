const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()

module.exports = async (req, res, next) => {
    try {
        var [rows] = await db.query('SELECT ID FROM CARD_TYPE WHERE ID = ?', req.body.idCardType)
    }
    catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
    }
    if (rows.length == 0)
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Card type not found' })
    req.idCardType = rows[0].ID
    next()
}