const { StatusCodes } = require('http-status-codes')
const db = require('../../../database/db')()

module.exports = [
    require('../middleware/getCollection'),
    async (req, res) => {
        if (req.body.name) {
            try {
                await db.execute('UPDATE COLLECTION SET NAME = ?, UPDATED_AT = NOW() WHERE ID = ?', [req.body.name, req.collection.id])
            } catch (err) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: err.sqlMessage })
            }
        }
        if (req.body.settings) {
            try {
                await db.execute('UPDATE COLLECTION SET SETTINGS = ?, UPDATED_AT = NOW() WHERE ID = ?', [JSON.stringify(req.body.settings), req.collection.id])
            } catch (err) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: err.sqlMessage })
            }
        }
        return res.status(StatusCodes.NO_CONTENT).json()
    }
]