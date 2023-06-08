const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()
const getCardJson = require('../services/getCardJson')

module.exports = [
    require('../middleware/getCollection'),
    require('../middleware/getLesson'),
    require('../middleware/getCardType'),
    require('../middleware/getCard'),
    async (req, res) => {
        try {
            var cardJson = getCardJson(req.idCardType, req.body)
        }
        catch (ex) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                error: 'Erro ao alterar cartão: ' + ex
            })
        }

        try {
            await db.query('UPDATE CARD SET ID_LESSON = ?, ID_CARD_TYPE = ?, CARD = ?, UPDATED_AT = NOW() WHERE ID = ?', [req.lesson.id, req.idCardType, JSON.stringify(cardJson), req.card.id])
        } catch (err) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: err.sqlMessage })
        }

        return res.status(StatusCodes.NO_CONTENT).json()
    }
]