const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()

module.exports = [
    require('../middleware/getCollection'),
    async (req, res) => {
        try {
            var [rows] = await
                db.query(`
SELECT L.ID AS ID_LESSON
FROM COLLECTION C
LEFT JOIN LESSON L ON L.ID_COLLECTION = C.ID
WHERE C.ID = ?`, req.collection.id)
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
        }

        const ogLessonIds = rows.map(r => r.ID_LESSON)

        if (req.body.lessons.length != ogLessonIds.length) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                error: `Coleção possui ${ogLessonIds.length} lições. Na requisição foram passadas ${req.body.lessons.length}`
            })
        }

        const idsAsSet = new Set(req.body.lessons);
        if (req.body.lessons.length !== idsAsSet.size) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                error: `Na requisição foram passadas lições duplicadas.`
            })
        }

        for (const idLesson of req.body.lessons) {
            if (!ogLessonIds.includes(idLesson))
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                    error: `Na requisição foi passada uma lição (${idLesson}) que não faz parte da coleção.`
                })
        }

        for (const [index, idLesson] of req.body.lessons.entries()) {
            try {
                await db.query('UPDATE LESSON SET `ORDER` = ?, UPDATED_AT = NOW() WHERE ID = ?', [index + 1, idLesson])
            } catch (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
            }
        }

        res.status(StatusCodes.NO_CONTENT).json()
    }
]