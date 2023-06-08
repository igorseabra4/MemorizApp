const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()

module.exports = async (req, res, next) => {
    try {
        var [rows] = await db.query(`SELECT ID, NAME, DESCRIPTION, \`ORDER\` FROM LESSON WHERE ID = ? AND ID_COLLECTION = ?`,
            [req.params.lessonId, req.collection.id])
    }
    catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.sqlMessage })
    }
    if (rows.length == 0)
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Lesson not found' })
    req.lesson = {
        id: rows[0].ID,
        name: rows[0].NAME,
        description: rows[0].DESCRIPTION,
        order: rows[0].ORDER
    }
    next()
}