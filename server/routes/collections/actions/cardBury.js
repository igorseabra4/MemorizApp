const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()
const { CardStatus } = require('../enums/CardStatus')

module.exports = [
    require('../middleware/getCollection'),
    require('../middleware/getLesson'),
    require('../middleware/getCard'),
    async (req, res) => {
        var newCardStatus
        if (req.body.buried)
            newCardStatus = CardStatus.SUSPENSO
        else if (req.card.dueAt)
            newCardStatus = CardStatus.REVISAO
        else
            newCardStatus = CardStatus.NOVO

        try {
            await db.query('UPDATE CARD SET ID_CARD_STATUS = ? WHERE ID = ?', [newCardStatus, req.card.id])
        } catch (err) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: err.sqlMessage })
        }

        return res.status(StatusCodes.NO_CONTENT).json()
    }
]