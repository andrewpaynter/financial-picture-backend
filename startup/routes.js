const express = require('express')

const users = require('../routes/users')
const auth = require('../routes/auth')
const transactions = require('../routes/transactions')
const error = require('../middleware/error')
const cors = require('cors')

module.exports = function (app) {
  app.use(express.json())
  app.use(cors({ exposedHeaders: ['x-auth-token'] }))
  app.use('/api/transactions', transactions)
  app.use('/api/users', users)
  app.use('/api/auth', auth)
  app.use(error)
}
