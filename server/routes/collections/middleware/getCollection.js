const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()

module.exports = async (req, res, next) => {
    try {
        var [rows] = await db.query('SELECT ID, NAME, SETTINGS FROM COLLECTION WHERE ID = ? AND ID_USER = ?', [req.params.collectionId, req.userId])
    }
    catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
    }
    if (rows.length == 0)
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Collection not found' })
    req.collection = {
        id: rows[0].ID,
        name: rows[0].NAME,
        settings: rows[0].SETTINGS
    }
    next()
}