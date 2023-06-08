const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()

module.exports = [
    require('../middleware/getCollection'),
    async (req, res) => {
        if (req.query.lessons == "false") {
            var lessons = null
        } else {
            try {
                var [rows] = await db.query('SELECT ID, NAME, DESCRIPTION, `ORDER` FROM LESSON WHERE ID_COLLECTION = ? ORDER BY `ORDER`', req.collection.id)
            } catch (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
            }

            var lessons = rows.map((row) => ({
                id: row.ID,
                name: row.NAME,
                description: row.DESCRIPTION,
                order: row.ORDER
            }))
        }

        if (req.query.cards == "false") {
            var cards = null
        } else {
            try {
                var [rows] = await db.query('SELECT ID, ID_LESSON, ID_CARD_TYPE, CARD, `ORDER`, ID_CARD_STATUS FROM CARD WHERE ID_COLLECTION = ? ORDER BY ID_LESSON, `ORDER`',
                    req.collection.id)
            } catch (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
            }

            var cards = rows.map((row) => ({
                id: row.ID,
                idLesson: row.ID_LESSON,
                idCardType: row.ID_CARD_TYPE,
                card: row.CARD,
                order: row.ORDER,
                idCardStatus: row.ID_CARD_STATUS
            }))
        }
        return res.json({
            name: req.collection.name,
            settings: req.collection.settings,
            lessons: lessons,
            cards: cards
        })
    }
]