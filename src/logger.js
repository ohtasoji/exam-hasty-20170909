const log4js = require('log4js');

let logger = log4js.getLogger();
logger.level = process.env.NODE_ENV === "production" ? "info" : 'debug';
logger.express = log4js.connectLogger(logger, {level: log4js.levels.INFO})

module.exports = logger;
