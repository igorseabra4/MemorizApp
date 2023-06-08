const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()
const { DEFAULT_CARTOES_INICIAR_LICAO } = require('../services/constants')

module.exports = async (req, res) => {
    if (req.body.name.length < 3)
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: 'Nome da coleção deve possuir pelo menos 3 caracteres.' })

    try {
        var [rows] = await db.query('SELECT 1 FROM COLLECTION WHERE ID_USER = ? AND NAME = ?', [req.userId, req.body.name])
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
    }

    if (rows.length > 0)
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: 'Já existe uma coleção com o nome especificado.' })

    const defaultSettings = {
        defaultNewCards: DEFAULT_CARTOES_INICIAR_LICAO,
        random: false
    }

    try {
        var [rows] = await db.query('INSERT INTO COLLECTION (ID_USER, NAME, CREATED_AT, UPDATED_AT, SETTINGS) VALUES (?, ?, NOW(), NOW(), ?)',
            [req.userId, req.body.name, JSON.stringify(defaultSettings)])
    } catch (err) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: err.sqlMessage })
    }

    const collectionId = rows.insertId

    try {
        var [rows] = await db.query('INSERT INTO LESSON (ID_COLLECTION, NAME, DESCRIPTION, `ORDER`, CREATED_AT, UPDATED_AT) VALUES (?, ?, ?, ?, NOW(), NOW())',
            [collectionId, 'Lição Padrão', '', 1])
    }
    catch (err) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: err.sqlMessage })
    }

    return res.status(StatusCodes.CREATED).json({
        idCollection: collectionId
    })
}