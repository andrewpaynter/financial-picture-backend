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
      db: 'mongodb://localhost:27017/financial-picture',
      level: 'error',
      handleExceptions: true,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.MongoDB({
      db: 'mongodb://localhost:27017/financial-picture',
      level: 'error',
    }),
  ],
})

module.exports = logger
