const express = require('express')
const addHours = require('date-fns/addHours')
const config = require('config')
const users = require('../routes/users')
const auth = require('../routes/auth')
const transactions = require('../routes/transactions')
const error = require('../middleware/error')
const cors = require('cors')
const cookieParser = require('cookie-parser')

module.exports = function (app) {
  app.use(express.json())
  app.use(
    cors({
      origin: [config.get('client'), config.get('secureClient')],
      credentials: true,
    })
  )
  app.use(
    cookieParser(config.get('cookiePrivateKey'), {
      httpOnly: true,
      expires: addHours(new Date(), 2),
    })
  )
  app.use('/api/transactions', transactions)
  app.use('/api/users', users)
  app.use('/api/auth', auth)
  app.use(error)
}
