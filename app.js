const express = require('express')
const app = express()
const logger = require('./startup/logger')

require('./startup/logger')
require('./startup/routes')(app)
require('./startup/db')()

const port = process.env.PORT || 3000
app.listen(port, () => logger.info(`Listening on port ${port}....`))
