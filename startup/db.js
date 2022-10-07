const mongoose = require('mongoose')
const logger = require('./logger')

module.exports = function () {
  mongoose.connect(process.env.DB).then(() => logger.info('Connected'))
}
