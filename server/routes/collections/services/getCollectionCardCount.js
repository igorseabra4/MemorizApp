const db = require('../../../database/db')()
const { CardStatus } = require('../enums/CardStatus')

const getCardCount = (rowsCol, cardStatus) => {
    var entry = rowsCol.find(rc => rc.ID_CARD_STATUS === cardStatus)
    return entry ? entry.COUNT : 0
}

const getCardCountDue = async (idCollection, idLesson = null) => {
    var [rows] = await db.query(`
SELECT COUNT(C.ID) AS COUNT
FROM CARD C
WHERE C.ID_COLLECTION = ? ${idLesson ? `AND C.ID_LESSON = ${idLesson}` : ''} AND C.ID_CARD_STATUS = ? AND C.DUE_AT <= NOW()`,
        [idCollection, CardStatus.REVISAO])
    return rows[0].COUNT
}

const getCollectionCardCount = async (idCollection, idLesson = null) => {
    try {
        var [rowsCol] = await db.query(`
SELECT C.ID_CARD_STATUS, COUNT(DISTINCT C.ID) AS COUNT
FROM CARD C
WHERE C.ID_COLLECTION = ? ${idLesson ? `AND C.ID_LESSON = ${idLesson}` : ''}
GROUP BY C.ID_CARD_STATUS`, idCollection)
        const v = {
            cardCountNew: getCardCount(rowsCol, CardStatus.NOVO),
            cardCountLearning: getCardCount(rowsCol, CardStatus.APRENDENDO),
            cardCountReview: getCardCount(rowsCol, CardStatus.REVISAO),
            cardCountDue: await getCardCountDue(idCollection, idLesson),
            cardCountFailed: getCardCount(rowsCol, CardStatus.FALHADO),
            cardCountBuried: getCardCount(rowsCol, CardStatus.SUSPENSO)
        }
        return v
    }
    catch (err) {
        throw err.sqlMessage
    }
}

module.exports = { getCollectionCardCount }