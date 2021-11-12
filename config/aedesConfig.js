//AEDES MQTT BROKER
const logger = require('../utils/logger')
const mongo = require("./mongoConfig");

if (process.env.MongoDBUser !== "") {
    logger.showDebug("Found Mongo DB credential")
} else {
    logger.showDebug("Cannot Found Mongo DB credential, Using Direct Connection")
}

/*** Define Aedes Service
 *** MQ mqEmitter, will save documents in pubsub, otherwise goes to collection: messages
 *** Persistence: MongoDB Persistence
 ***/
const aedesService = require('aedes')({
    id: 'SensorPotBroker',

    mq: process.env.UseMqEmitter === 'true' ? mongo.mqEmitter({
        url: mongo.mongoDBAddress,
    }) : null,

    concurrency: process.env.concurrency,

    persistence: process.env.UsePersistence === 'true' ? process.env.MongoDBUser !== "" ? mongo.mongoPersistence({
            url: mongo.mongoDBAddress,
            mongoOptions: {
                auth: {
                    user: process.env.MongoDBUser,
                    password: process.env.MongoDBPassword
                }
            },
            ttl: {
                packets: process.env.TTLPackets,
                subscriptions: process.env.TTLSubscriptions
            }
        }) :
        mongo.mongoPersistence({
            url: mongo.mongoDBAddress,
            // Optional ttl settings
            ttl: {
                packets: process.env.TTLPackets,
                subscriptions: process.env.TTLSubscriptions
            }
        }) : null
});

process.env.UseMqEmitter === 'true' ? logger.showInfo("Mq Emitter Initialised") : logger.showInfo("No Mq Emitter Initialised")
process.env.UsePersistence === 'true' ? logger.showInfo("MongoDB Persistence Initialised") : logger.showInfo("No MongoDB Persistence Started")

logger.showInfo("AEDES Service Started, internal connecting...")

module.exports = aedesService;
