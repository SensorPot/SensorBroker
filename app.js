//region Library
//Import FS For loading certification
const fs = require('fs')
//aedes-persistence-mongodb
const mqEmitter = require('mqemitter-mongodb')
const mongoPersistence = require('aedes-persistence-mongodb')
//endregion

//region Configuration
const port = 1883
const mongoDBAddress = "mongodb://127.0.0.1/SensorPot";

/* TODO: USE THE FOLLOWING CODE FOR PRODUCTION BUILD

const port = 8883

const options = {
    key: fs.readFileSync('YOUR_PRIVATE_KEY_FILE.pem'),
    cert: fs.readFileSync('YOUR_PUBLIC_CERT_FILE.pem')
}

const server = require('tls').createServer(options, aedes.handle)
 */

//AEDES MQTT BROKER
const aedes = require('aedes')({
    id: 'SensorPotBroker',
    mq: mqEmitter({
        url: mongoDBAddress
    }),
    persistence: mongoPersistence({
        url: mongoDBAddress,
        // Optional ttl settings
        ttl: {
            packets: 300, // Number of seconds
            subscriptions: 300
        }
    })
})

//endregion

const server = require('net').createServer(aedes.handle)

server.listen(port, function () {
    console.log('server started and listening on port ', port)
})

//region Aedes Event Listeners

/* TODO AUTHENTICATE
aedes.authenticate = function (client, username, password, callback) {
    callback(null, (username === 'user' && password.toString() === '123456'));
}
*/

aedes.on('client', function (client) {
    console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id);
});

aedes.on('clientDisconnect', function (client) {
    console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id);
});

aedes.on('publish', async function (packet, client) {
    console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)
})

//endregion