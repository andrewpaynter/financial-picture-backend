const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const jwt = require('jsonwebtoken')
const config = require('config')

const userData = new mongoose.Schema({
  allTags: {
    type: [{ type: String, minLength: 1, maxLength: 255 }],
    validate: {
      validator: function (v) {
        return v && v.length <= 255
      },
      message: 'Maximum 255 Tags',
    },
    default: [],
  },
  allCategories: {
    type: [{ type: String, minLength: 1, maxLength: 255 }],
    validate: {
      validator: function (v) {
        return v && v.length <= 255
      },
      message: 'Maximum 255 Categories',
    },
    default: [],
  },
})

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
    maxLength: 255,
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
    maxLength: 1024,
  },
  userData: {
    type: userData,
    default: {
      allTags: [],
      allCategories: [],
    },
  },
})

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'))
  return token
}

const User = mongoose.model('User', userSchema)

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(7).max(255).required(),
    userData: Joi.object,
  })
  return schema.validate(user)
}

module.exports.User = User
module.exports.validateUser = validateUser
