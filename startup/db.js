const mongoose = require('mongoose')
const config = require('config')
const logger = require('./logger')

module.exports = function () {
  mongoose.connect(config.get('db')).then(() => logger.info('Connected'))
}
