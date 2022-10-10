const express = require('express')
const { User } = require('../models/user')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const auth = require('../middleware/auth')
const addHours = require('date-fns/addHours')

router.post('/', async (req, res) => {
  const { error } = validate(req)
  if (error) {
    return res.status(400).send({ message: error.details[0].message })
  }

  let user = await User.findOne({ email: req.body.email })
  if (!user)
    return res.status(400).send({ message: 'Invalid email or password' })

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword)
    return res.status(400).send({ message: 'Invalid email or password' })

  const token = user.generateAuthToken()

  res
    .cookie('auth_token', token, {
      httpOnly: true,
      expires: addHours(new Date(), 2),
      signed: true,
      sameSite: 'none',
      secure: true,
    })
    .send({
      name: user.name,
      email: user.email,
      userData: user.userData,
      message: 'Logged in successfully!',
    })
})

router.delete('/', async (req, res) => {
  res
    .clearCookie('auth_token')
    .status(200)
    .send({ message: 'Logged out successfully!' })
})

router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  return res.status(200).send({
    message: 'Valid auth',
    name: user.name,
    email: user.email,
    userData: user.userData,
  })
})

const validate = (req) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email().messages({
      'any.required': 'Email required',
      'string.empty': 'Email required',
      'string.min': `Email should have at least 5 characters`,
      'string.max': `Email should have at most 255 characters`,
      'string.email': 'Email invalid',
    }),
    password: Joi.string().min(7).max(255).required().messages({
      'any.required': 'Password required',
      'string.empty': 'Password required',
      'string.min': `Invalid email or password`,
      'string.max': `Invalid email or password`,
    }),
  })
  return schema.validate(req.body)
}

module.exports = router
