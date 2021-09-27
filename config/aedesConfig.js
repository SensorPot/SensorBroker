//AEDES MQTT BROKER
const logger = require('../utils/logger')
const mongo = require("./mongoConfig");

if (process.env.MongoDBUser !== "") {
    logger.showDebug("Found Mongo DB credential")
} else {
    logger.showDebug("Cannot Found Mongo DB credential, Using Direct Connection")
}

const aedesService = require('aedes')({
    id: 'SensorPotBroker',
    mq: mongo.mqEmitter({
        url: mongo.mongoDBAddress
    }),
    persistence: process.env.MongoDBUser !== "" ? mongo.mongoPersistence({
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
        })
});


logger.showInfo("AEDES Service Started")

module.exports = aedesService;