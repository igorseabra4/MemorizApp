const { StatusCodes } = require('http-status-codes')
const { getCollectionCardCount } = require('../services/getCollectionCardCount')
const db = require('../../../database/db')()

module.exports = async (req, res) => {
    try {
        var [rows] = await db.query(`
SELECT COL.ID, COL.NAME, COUNT(C.ID) AS CARD_COUNT
FROM COLLECTION COL
LEFT JOIN CARD C ON C.ID_COLLECTION = COL.ID
WHERE ID_USER = ?
GROUP BY COL.ID
ORDER BY COL.CREATED_AT`,
            req.userId)
    }
    catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
    }

    var result = []
    for (let collection of rows) {
        try {
            result.push({
                id: collection.ID,
                name: collection.NAME,
                cardCount: collection.CARD_COUNT,
                ...await getCollectionCardCount(collection.ID)
            })
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err })
        }
    }
    return res.json(result)
}