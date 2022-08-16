const express = require('express')
const router = express.Router()
const { Transaction, validateTransaction } = require('../models/transaction')
const auth = require('../middleware/auth')
const validateID = require('../middleware/validateID')

router.get('/', auth, async (req, res) => {
  const transactions = await Transaction.find().sort('title')
  res.send(transactions)
})

router.get('/:id', auth, validateID, async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
  if (!transaction)
    return res
      .status(404)
      .send({ error: 'The transaction with the given ID was not found' })
  res.send(transaction)
})

router.post('/', auth, async (req, res) => {
  const { error } = validateTransaction(req.body)
  if (error) return res.status(400).send({ message: error.details[0].message })

  const transaction = new Transaction({
    title: req.body.title,
    amount: req.body.amount,
    date: req.body.date,
    category: req.body.category,
    location: req.body.location,
    tags: req.body.tags,
  })
  await transaction.save()
  res.send(transaction)
})

router.put('/:id', auth, validateID, async (req, res) => {
  const { error } = validateTransaction(req.body)
  if (error) return res.status(400).send({ message: error.details[0].message })

  const transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      amount: req.body.amount,
      date: req.body.date,
      category: req.body.category,
      location: req.body.location,
      tags: req.body.tags,
    },
    { new: true }
  )

  if (!transaction)
    return res
      .status(404)
      .send({ message: 'The transaction with the given ID was not found' })

  res.send(transaction)
})

router.delete('/:id', auth, validateID, async (req, res) => {
  const transaction = await Transaction.findByIdAndRemove(req.params.id)
  if (!transaction)
    return res
      .status(404)
      .send({ message: 'The transaction with the given ID was not found' })

  res.send(transaction)
})

module.exports = router
