const express = require('express')

const addHours = require('date-fns/addHours')
const users = require('../routes/users')
const auth = require('../routes/auth')
const transactions = require('../routes/transactions')
const error = require('../middleware/error')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const config = require('config')

module.exports = function (app) {
  app.use(express.json())
  app.use(cors({ origin: ['http://localhost:8001'], credentials: true }))
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
