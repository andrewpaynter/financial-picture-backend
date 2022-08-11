const express = require('express')

const users = require('../routes/users')
const auth = require('../routes/auth')
const transactions = require('../routes/transactions')
const error = require('../middleware/error')
const cors = require('cors')
const cookieParser = require('cookie-parser')

module.exports = function (app) {
  app.use(express.json())
  app.use(cors({ origin: ['http://localhost:8001'], credentials: true }))
  app.use(cookieParser())
  app.use('/api/transactions', transactions)
  app.use('/api/users', users)
  app.use('/api/auth', auth)
  app.use(error)
}
