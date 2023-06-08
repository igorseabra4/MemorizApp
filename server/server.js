const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.use(require('./routes/users/router'))
app.use(require('./routes/collections/router'))

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})