const express = require('express')
const { User } = require('../models/user')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Joi = require('joi')

router.post('/', async (req, res) => {
  const { error } = validate(req)
  if (error) return res.status(400).send({ message: error.details[0].message })

  let user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('Invalid email or password')

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send('Invalid email or password')

  const token = user.generateAuthToken()

  res.cookie('auth_token', token, { signed: true }).send({
    name: user.name,
    email: user.email,
    userData: user.userData,
  })
})

const validate = (req) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(7).max(255).required(),
  })
  return schema.validate(req.body)
}

module.exports = router
