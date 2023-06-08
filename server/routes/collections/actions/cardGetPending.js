const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()
const { CardStatus } = require('../enums/CardStatus')

const rowToCard = row => ({
    id: row.ID,
    idCardStatus: row.ID_CARD_STATUS,
    idCardType: row.ID_CARD_TYPE,
    card: row.CARD
})

module.exports = [
    require('../middleware/getCollection'),
    async (req, res) => {
        // impede que eu mande o mesmo cartão duas vezes seguidas
        const orderByPrevId = req.query.prevCardId ? `C.ID = ${req.query.prevCardId} ASC,` : ''

        try {
            var [rows] = await db.query(`
SELECT C.ID, C.ID_CARD_STATUS, C.ID_CARD_TYPE, C.CARD
FROM CARD C
LEFT JOIN LESSON L ON C.ID_LESSON = L.ID
WHERE C.ID_COLLECTION = ? AND C.ID_CARD_STATUS = ?
ORDER BY ${orderByPrevId} ${req.collection.settings.random ? 'RAND()' : 'L.ORDER ASC, C.ORDER ASC'}
LIMIT 1`, [req.collection.id, CardStatus.APRENDENDO])
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
        }

        if (rows.length != 0)
            return res.json({
                isDue: true,
                card: rowToCard(rows[0])
            })

        try {
            var [rows] = await db.query(`
SELECT C.ID, C.ID_CARD_STATUS, C.ID_CARD_TYPE, C.CARD
FROM CARD C
LEFT JOIN LESSON L ON C.ID_LESSON = L.ID
WHERE C.ID_COLLECTION = ? AND C.ID_CARD_STATUS = ? AND C.DUE_AT <= NOW()
ORDER BY ${orderByPrevId} ${req.collection.settings.random ? 'RAND()' : 'L.ORDER ASC, C.ORDER ASC'}
LIMIT 1`, [req.collection.id, CardStatus.REVISAO])
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
        }

        if (rows.length != 0)
            return res.json({
                isDue: true,
                card: rowToCard(rows[0])
            })

        try {
            var [rows] = await db.query(`
SELECT C.ID, C.ID_CARD_STATUS, C.ID_CARD_TYPE, C.CARD
FROM CARD C
LEFT JOIN LESSON L ON C.ID_LESSON = L.ID
WHERE C.ID_COLLECTION = ? AND C.ID_CARD_STATUS = ?
ORDER BY ${orderByPrevId} ${req.collection.settings.random ? 'RAND()' : 'L.ORDER ASC, C.ORDER ASC'}
LIMIT 1`, [req.collection.id, CardStatus.FALHADO])
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
        }

        if (rows.length != 0)
            return res.json({
                isDue: true,
                card: rowToCard(rows[0])
            })

        return res.json({
            isDue: false,
            card: null
        })
    }
]