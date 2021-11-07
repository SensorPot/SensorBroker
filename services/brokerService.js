//region Library
const fs = require('fs')
const logger = require('../utils/logger')
const aedes = require('../config/aedesConfig')
const mongoose = require("./mongoService");
const MessageModel = require("../models/message");

//endregion

let brokerServer;
let port;
let dbConn = mongoose.connection

//region Configuration
if (process.env.KeyFile !== "" && process.env.CertFile !== "") {
    logger.showLog("Found local KeyFile and CertFile")
    port = process.env.BrokerTlsPort;
    const options = {
        key: fs.readFileSync(process.env.KeyFile),
        cert: fs.readFileSync(process.env.CertFile)
    }
    brokerServer = require('tls').createServer(options, aedes.handle)
} else {
    logger.showDebug("Cannot Found local KeyFile and CertFile")
    port = process.env.BrokerNetPort;
    brokerServer = require('net').createServer(aedes.handle)
}
//endregion

brokerServer.listen(port, function () {
    if (port === "1883") {
        logger.showWarning('Starting Broker Service in NET mode')
    } else {
        logger.showInfo('Starting Broker Service in TLS mode')
    }
    logger.showInfo('Server started and listening on port ' + port)
})

//region AEDES Event Listeners

aedes.on('client', function (client) {
    logger.showLog('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m')
});

aedes.on('clientDisconnect', function (client) {
    logger.showLog('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m')
});

aedes.on('publish', async function (packet, client) {
    if (client) {
        try {
            if (process.env.UseMqEmitter === 'false') {
                let tempPackage = JSON.parse(packet.payload.toString());
                const message = new MessageModel(
                    {
                        sensorID: tempPackage.sensorID,
                        groupID: tempPackage.groupID,
                        timestamp: tempPackage.timestamp,
                        payload: JSON.stringify(tempPackage.payload)
                    }
                )
                message.save(function (err) {
                    if (err) {
                        logger.showError('Saving Document Error: ' + err.message)
                    }
                });
            }
            logger.showLog('Client \x1b[31m' + client.id + '\x1b[0m has published \x1b[34m' + packet.payload.toString() + '\x1b[0m')
        } catch (e) {
            throw e.message;
        }

    }
})

//endregion

module.exports = brokerServer;
