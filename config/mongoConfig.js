//aedes-persistence-mongodb
//mqemitter-mongodb
const logger = require('../utils/logger')
const mqEmitter = require('mqemitter-mongodb')
const mongoPersistence = require('aedes-persistence-mongodb')
const mongoDBAddress = process.env.MongoDBAddress;

logger.showInfo("MongoDB Address: " + mongoDBAddress)

module.exports = {
    mqEmitter,
    mongoPersistence,
    mongoDBAddress
};