const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()

module.exports = [
    require('../middleware/getCollection'),
    require('../middleware/getLesson'),
    async (req, res) => {
        try {
            await db.query('DELETE FROM LESSON WHERE ID = ?', req.lesson.id)
        } catch (err) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: err.sqlMessage })
        }

        try {
            var [rows] = await
                db.query(`
SELECT L.ID AS ID_LESSON
FROM LESSON L
WHERE L.ID_COLLECTION = ?
ORDER BY L.ORDER`, req.collection.id)
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
        }

        const ogLessonIds = rows.map(r => r.ID_LESSON)
        for (const [index, idLesson] of ogLessonIds.entries()) {
            try {
                await db.query('UPDATE LESSON SET `ORDER` = ?, UPDATED_AT = NOW() WHERE ID = ?', [index + 1, idLesson])
            } catch (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
            }
        }

        return res.status(StatusCodes.NO_CONTENT).json()
    }
]