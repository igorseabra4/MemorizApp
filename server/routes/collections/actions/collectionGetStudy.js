const { StatusCodes } = require('http-status-codes')
const { getCollectionCardCount } = require('../services/getCollectionCardCount')
const { CardStatus } = require('../enums/CardStatus')
const db = require('../../../database/db')()

module.exports = [
    require('../middleware/getCollection'),
    async (req, res) => {
        try {
            var [rows] = await db.query('SELECT ID, NAME, DESCRIPTION, `ORDER` FROM LESSON WHERE ID_COLLECTION = ? ORDER BY `ORDER`', req.collection.id)
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
        }

        var lessons = []
        for (let row of rows) {
            try {
                var [rowsLesson] = await db.query(`
SELECT COUNT(C.ID) AS COUNT
FROM CARD C
WHERE C.ID_COLLECTION = ? AND C.ID_LESSON = ? AND C.ID_CARD_STATUS = ?`, [req.collection.id, row.ID, CardStatus.NOVO])
            } catch (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
            }
            lessons.push({
                id: row.ID,
                name: row.NAME,
                description: row.DESCRIPTION,
                order: row.ORDER,
                countNew: rowsLesson[0].COUNT
            })
        }

        try {
            return res.json({
                name: req.collection.name,
                lessons: lessons,
                ...req.collection.settings,
                ...await getCollectionCardCount(req.collection.id)
            })
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err })
        }
    }
]