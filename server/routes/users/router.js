const express = require('express')
const router = express.Router()

router.post('/auth/register', require('./actions/userCreatePost'))
router.post('/auth/login', require('./actions/userLoginPost'))

router.get('/auth', require('./middleware/auth'), async (req, res) => res.json())

module.exports = router