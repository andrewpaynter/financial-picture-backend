const mongoose = require('mongoose')
const logger = require('./logger')

module.exports = function () {
  mongoose.connect(process.env.fp_db).then(() => logger.info('Connected'))
}
