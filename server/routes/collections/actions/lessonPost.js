const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()

module.exports = [
    require('../middleware/getCollection'),
    async (req, res) => {
        try {
            var [rows] = await db.query('SELECT MAX(`ORDER`) AS `ORDER` FROM LESSON WHERE ID_COLLECTION = ?', req.collection.id)
        }
        catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
        }

        const order = rows.length == 0 ? 1 : (rows[0].ORDER + 1)

        try {
            var [rows] = await db.query('INSERT INTO LESSON (ID_COLLECTION, NAME, DESCRIPTION, `ORDER`, CREATED_AT, UPDATED_AT) VALUES (?, ?, ?, ?, NOW(), NOW())',
                [req.collection.id, req.body.name, req.body.description, order])
        } catch (err) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: err.sqlMessage })
        }

        return res.status(StatusCodes.CREATED).json({
            'lessonId': rows.insertId
        })
    }
]