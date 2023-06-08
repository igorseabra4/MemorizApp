const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()
const { CardStatus } = require('../enums/CardStatus')
const { CardAnswer } = require('../enums/CardAnswer')
const { MIN_ESPACAMENTO_APRENDENDO, MAX_QTDE_REPETICOES_APRENDENDO, MIN_EASINESS_FACTOR } = require('../services/constants')

const getNewEasinessFactor = (cardStatus, answer, easinessFactor) => {
    var newEasinessFactor
    if (answer == CardAnswer.ERRADO) {
        newEasinessFactor = easinessFactor - 0.8
    } else if (cardStatus == CardStatus.APRENDENDO || cardStatus == CardStatus.FALHADO) {
        newEasinessFactor = easinessFactor + 0.1
    } else {
        if (answer == CardAnswer.DIFICIL)
            var factor = 0
        else if (answer == CardAnswer.CORRETO)
            var factor = 1
        else if (answer == CardAnswer.FACIL)
            var factor = 2
        else
            throw "Responsta inválida."

        newEasinessFactor = easinessFactor + 0.1 + factor * (0.08 - factor * 0.02)
    }
    return Math.max(newEasinessFactor, MIN_EASINESS_FACTOR)
}

module.exports = [
    require('../middleware/getCollection'),
    require('../middleware/getCard'),
    async (req, res) => {
        var newIntervalSeconds
        var newCardStatus
        try {
            var newEasinessFactor = getNewEasinessFactor(req.card.idCardStatus, req.body.answer, req.card.easinessFactor)
        } catch (e) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: e })
        }

        switch (req.card.idCardStatus) {
            case CardStatus.APRENDENDO:
                if (req.body.answer == CardAnswer.ERRADO) {
                    newIntervalSeconds = Math.min(req.card.lastInterval + 2, MAX_QTDE_REPETICOES_APRENDENDO)
                    newCardStatus = CardStatus.APRENDENDO
                } else if (req.body.answer == CardAnswer.CORRETO) {
                    newIntervalSeconds = req.card.lastInterval - 1
                    newCardStatus = CardStatus.APRENDENDO
                    if (newIntervalSeconds == 0) {
                        newIntervalSeconds = MIN_ESPACAMENTO_APRENDENDO
                        newCardStatus = CardStatus.REVISAO
                    }
                } else {
                    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "Para cartões 'aprendendo', a resposta deve ser 'OK' ou 'ERRADO'." })
                }
                break;
            case CardStatus.REVISAO:
                if (req.body.answer == CardAnswer.ERRADO) {
                    newIntervalSeconds = null
                    newCardStatus = CardStatus.FALHADO
                } else {
                    newIntervalSeconds = Math.max(req.card.lastInterval * newEasinessFactor, MIN_ESPACAMENTO_APRENDENDO);
                    newCardStatus = CardStatus.REVISAO
                }
                break;
            case CardStatus.FALHADO:
                if (req.body.answer == CardAnswer.ERRADO) {
                    newIntervalSeconds = null
                    newCardStatus = CardStatus.FALHADO
                } else if (req.body.answer == CardAnswer.CORRETO) {
                    newIntervalSeconds = 0
                    newCardStatus = CardStatus.REVISAO
                } else {
                    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "Para cartões 'falhados', a resposta deve ser 'OK' ou 'ERRADO'." })
                }
                break;
            case CardStatus.NOVO:
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "Cartões 'novos' não podem ser respondidos." })
            case CardStatus.SUSPENSO:
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "Cartões 'suspensos' não podem ser respondidos." })
            default:
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Ocorreu um erro interno." })
        }

        var newDueAt = newCardStatus == CardStatus.REVISAO ? `NOW() + INTERVAL ${newIntervalSeconds} SECOND` : 'NULL'

        try {
            await db.query(`UPDATE CARD SET ID_CARD_STATUS = ?, LAST_SEEN_AT = NOW(), LAST_INTERVAL = ?, DUE_AT = ${newDueAt}, EASINESS_FACTOR = ? WHERE ID = ?`,
                [newCardStatus, newIntervalSeconds, newEasinessFactor, req.card.id])
        } catch (err) {
            console.log(err)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
        }

        return res.status(StatusCodes.NO_CONTENT).json()
    }
]