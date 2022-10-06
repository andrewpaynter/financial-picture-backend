const express = require('express')
const helmet = require('helmet')
const addHours = require('date-fns/addHours')
const users = require('../routes/users')
const auth = require('../routes/auth')
const transactions = require('../routes/transactions')
const error = require('../middleware/error')
const cors = require('cors')
const cookieParser = require('cookie-parser')

module.exports = function (app) {
  app.use(express.json())
  app.use(helmet())
  app.use(
    cors({
      origin: [
        'https://financial-picture.onrender.com',
        'http://financial-picture.onrender.com',
      ],
      credentials: true,
    })
  )
  app.use(
    cookieParser(process.env.COOKIE_PRIVATE_KEY, {
      httpOnly: true,
      expires: addHours(new Date(), 2),
    })
  )
  app.use('/api/transactions', transactions)
  app.use('/api/users', users)
  app.use('/api/auth', auth)
  app.use(error)
}
