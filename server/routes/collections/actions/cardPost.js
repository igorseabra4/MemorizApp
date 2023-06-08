const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()
const getCardJson = require('../services/getCardJson')
const { CardStatus } = require('../enums/CardStatus')

module.exports = [
    require('../middleware/getCollection'),
    require('../middleware/getLesson'),
    require('../middleware/getCardType'),
    async (req, res) => {
        try {
            var cardJson = getCardJson(req.idCardType, req.body)
        }
        catch (ex) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                error: 'Erro ao criar cartão: ' + ex
            })
        }

        try {
            var [rows] = await db.query('SELECT MAX(`ORDER`) AS `ORDER` FROM CARD WHERE ID_COLLECTION = ? AND ID_LESSON = ?', [req.collection.id, req.lesson.id])
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
        }

        const order = rows.length == 0 ? 1 : (rows[0].ORDER + 1)
        try {
            await db.query('INSERT INTO CARD (ID_COLLECTION, ID_LESSON, ID_CARD_TYPE, CARD, \`ORDER\`, CREATED_AT, UPDATED_AT, ID_CARD_STATUS) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?)',
                [req.collection.id, req.lesson.id, req.idCardType, JSON.stringify(cardJson), order, CardStatus.NOVO])
        } catch (err) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: err.sqlMessage })
        }

        return res.status(StatusCodes.CREATED).json({
            idCard: rows.insertId
        })
    }
]