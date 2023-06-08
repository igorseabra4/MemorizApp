const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()

module.exports = async (req, res, next) => {
    try {
        var [rows] = await db.query('SELECT ID, ID_CARD_STATUS, ID_CARD_TYPE, LAST_SEEN_AT, LAST_INTERVAL, DUE_AT, EASINESS_FACTOR, CARD FROM CARD WHERE ID = ? AND ID_COLLECTION = ?',
            [req.params.cardId, req.collection.id])
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
    }
    if (rows.length == 0)
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Card not found' })
    req.card = {
        id: rows[0].ID,
        idCardType: rows[0].ID_CARD_TYPE,
        idCardStatus: rows[0].ID_CARD_STATUS,
        lastSeenAt: rows[0].LAST_SEEN_AT,
        dueAt: rows[0].DUE_AT,
        lastInterval: rows[0].LAST_INTERVAL,
        easinessFactor: rows[0].EASINESS_FACTOR,
        card: rows[0].CARD
    }
    return next()
}