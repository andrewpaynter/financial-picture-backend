const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
  coordinates: Object,
})

const Transaction = mongoose.model(
  'Transaction',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 255,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    category: String,
    location: locationSchema,
    tags: {
      type: [{ type: String, minLength: 1, maxLength: 255 }],
      validate: {
        validator: function (v) {
          return v && v.length <= 255
        },
        message: 'Maximum 255 Tags',
      },
    },
  })
)

const validateTransaction = (transaction) => {
  const schema = Joi.object({
    id: Joi.objectId(),
    title: Joi.string().min(1).max(255).required(),
    amount: Joi.number().required(),
    date: Joi.date(),
    category: Joi.string(),
    location: Joi.object(),
    tags: Joi.array(),
  })
  return schema.validate(transaction)
}

module.exports.Transaction = Transaction
module.exports.validateTransaction = validateTransaction
