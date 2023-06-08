const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()

module.exports = [
    require('../middleware/getCollection'),
    require('../middleware/getLesson'),
    async (req, res) => {
        try {
            await db.query('UPDATE LESSON SET NAME = ?, DESCRIPTION = ?, UPDATED_AT = NOW() WHERE ID = ?', [req.body.name, req.body.description, req.lesson.id])
        } catch (err) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: err.sqlMessage })
        }
        return res.status(StatusCodes.NO_CONTENT).json()
    }
]