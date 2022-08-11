const express = require('express')
const { User, validateUser } = require('../models/user')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth')

router.get('/me', async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  res.send(user)
})

router.post('/', async (req, res) => {
  const { error } = validateUser(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send('User already registered')

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  await user.save()

  const token = user.generateAuthToken()

  res.cookie('auth_token', token).send({
    name: user.name,
    email: user.email,
    userData: user.userData,
  })
})

module.exports = router
