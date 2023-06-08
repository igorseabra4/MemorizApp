const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()

module.exports = [
    require('../middleware/getCollection'),
    require('../middleware/getLesson'),
    async (req, res) => {
        try {
            var [rows] = await
                db.query(`
SELECT C.ID AS ID_CARD
FROM LESSON L
LEFT JOIN CARD C ON C.ID_COLLECTION = ? AND C.ID_LESSON = L.ID
WHERE L.ID = ?`, [req.collection.id, req.lesson.id])
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
        }

        const ogCardIds = rows.map(r => r.ID_CARD)

        if (req.body.cards.length != ogCardIds.length) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                error: `Lição possui ${ogCardIds.length} cartões. Na requisição foram passados ${req.body.cards.length}`
            })
        }

        const idsAsSet = new Set(req.body.cards);
        if (req.body.cards.length !== idsAsSet.size) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                error: `Na requisição foram passados cartões duplicados.`
            })
        }

        for (const idCard of req.body.cards) {
            if (!ogCardIds.includes(idCard))
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                    error: `Na requisição foi passado um cartão (${idCard}) que não faz parte da lição.`
                })
        }

        for (const [index, idCard] of req.body.cards.entries()) {
            try {
                await db.query('UPDATE CARD SET `ORDER` = ?, UPDATED_AT = NOW() WHERE ID = ?', [index + 1, idCard])
            } catch (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
            }
        }

        res.status(StatusCodes.NO_CONTENT).json()
    }
]