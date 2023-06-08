const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()
const { CardStatus } = require('../enums/CardStatus')
const { DEFAULT_CARTOES_INICIAR_LICAO, DEFAULT_QTDE_REPETICOES_APRENDENDO, DEFAULT_EASINESS_FACTOR } = require('../services/constants')

module.exports = [
    require('../middleware/getCollection'),
    require('../middleware/getLesson'),
    async (req, res) => {
        try {
            var [rows] = await db.query(`SELECT ID FROM CARD WHERE ID_LESSON = ? AND ID_CARD_STATUS = ? ORDER BY \`ORDER\` LIMIT ${req.query.limit || DEFAULT_CARTOES_INICIAR_LICAO}`,
                [req.lesson.id, CardStatus.NOVO])
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
        }

        if (rows.length == 0)
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: 'Lição não possui cartões novos.' })

        const cardIds = rows.map(row => row.ID)

        try {
            var [rows] = await db.query('UPDATE CARD SET ID_CARD_STATUS = ?, LAST_SEEN_AT = NULL, LAST_INTERVAL = ?, EASINESS_FACTOR = ? WHERE ID IN (?)',
                [CardStatus.APRENDENDO, DEFAULT_QTDE_REPETICOES_APRENDENDO, DEFAULT_EASINESS_FACTOR, cardIds])
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
        }

        return res.json()
    }
]