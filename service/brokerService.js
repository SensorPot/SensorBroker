//region Library
const fs = require('fs')
const logger = require('../utils/logger')
const aedes = require('../config/aedesConfig')
//endregion
let brokerServer;
let port;
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
    logger.showInfo('server started and listening on port ' + port)
})

//region Aedes Event Listeners

aedes.on('client', function (client) {
    logger.showLog('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m')
});

aedes.on('clientDisconnect', function (client) {
    logger.showLog('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m')
});

aedes.on('publish', async function (packet, client) {
    //logger.showLog('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published ' + packet.payload.toString())
    if (client) {
        logger.showLog('Client \x1b[31m' + client.id + '\x1b[0m has published \x1b[34m' + packet.payload.toString() + '\x1b[0m')
    }
})

//endregion

module.exports = brokerServer;