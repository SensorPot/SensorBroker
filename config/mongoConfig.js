//aedes-persistence-mongodb
//mqemitter-mongodb
const logger = require('../utils/logger')
const mqEmitter = require('mqemitter-mongodb')
const mongoPersistence = require('aedes-persistence-mongodb')
const mongoDBAddress = process.env.MongoDBAddress;

const mongoOptions = {
    user: process.env.MongoDBUser ? process.env.MongoDBUser : "",
    pass: process.env.MongoDBPassword ? process.env.MongoDBPassword : "",
    autoIndex: process.env.MG_autoIndex ? process.env.MG_autoIndex : false,
    minPoolSize: process.env.MG_minPoolSize ? process.env.MG_minPoolSize : 100,
    maxPoolSize: process.env.MG_maxPoolSize ? process.env.MG_maxPoolSize : 1000,
    socketTimeoutMS: process.env.MG_socketTimeoutMS ? process.env.MG_socketTimeoutMS : 30000,
    family: process.env.MG_family ? process.env.MG_family : 4,
    serverSelectionTimeoutMS: process.env.MG_serverSelectionTimeoutMS ? process.env.MG_serverSelectionTimeoutMS : 30000,
    heartbeatFrequencyMS: process.env.MG_heartbeatFrequencyMS ? process.env.MG_heartbeatFrequencyMS : 30000
}

logger.showInfo("MongoDB Address: " + mongoDBAddress)

module.exports = {
    mqEmitter,
    mongoPersistence,
    mongoDBAddress,
    mongoOptions
};
