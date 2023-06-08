const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()

module.exports = [
    require('../middleware/getCollection'),
    require('../middleware/getLesson'),
    require('../middleware/getCard'),
    async (req, res) => {
        try {
            await db.query('DELETE FROM CARD WHERE ID = ?', req.card.id)
        } catch (err) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: err.sqlMessage })
        }

        try {
            var [rows] = await
                db.query(`
SELECT C.ID AS ID_CARD
FROM CARD C
WHERE C.ID_LESSON = ?
ORDER BY C.ORDER`, req.lesson.id)
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
        }

        const ogCardIds = rows.map(r => r.ID_CARD)
        for (const [index, idCard] of ogCardIds.entries()) {
            try {
                await db.query('UPDATE CARD SET `ORDER` = ?, UPDATED_AT = NOW() WHERE ID = ?', [index + 1, idCard])
            } catch (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
            }
        }

        return res.status(StatusCodes.NO_CONTENT).json()
    }
]