const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()

module.exports = [
    require('../middleware/getCollection'),
    async (req, res) => {
        try {
            await db.query('DELETE FROM COLLECTION WHERE ID = ?', req.collection.id)
        } catch (err) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: err.sqlMessage })
        }
        return res.status(StatusCodes.NO_CONTENT).json()
    }
]