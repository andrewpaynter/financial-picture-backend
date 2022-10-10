const winston = require('winston')
require('winston-mongodb')

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: 'logfile.log',
      level: 'error',
      handleExceptions: true,
    }),
    new winston.transports.MongoDB({
      db: process.env.DB,
      filename: 'logfile.log',
      handleExceptions: true,
    }),
  ],
})

module.exports = logger
