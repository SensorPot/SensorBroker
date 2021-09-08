# SensorBroker

MQTT Broker for Sensor Pot

## Environment Requirements

### 1. MongoDB

The project needs MongoDB as base database. **Locally MongoDB is highly recommended**

### 2. Certification for MQTT TLS

In order to improve overall MQTT security. Do use MQTT over TLS / MQTTS in production

```javascript
const fs = require('fs')
const aedes = require('aedes')()
//Change port from 1883 to 8883
const port = 8883

const options = {
    key: fs.readFileSync('YOUR_PRIVATE_KEY_FILE.pem'),
    cert: fs.readFileSync('YOUR_PUBLIC_CERT_FILE.pem')
}

//Change server from net to tls
const server = require('tls').createServer(options, aedes.handle)

server.listen(port, function () {
    console.log('server started and listening on port ', port)
})
```

## Function

By current design, AEDES only listen on those events:

* client - Client Connected
* clientDisconnect - Client Disconnected
* publish - Client published message

To config an event listener, use the following syntax:
`aedes.on('event', function (client) { });`

## Configuration

Copy ```env``` to ```.env``` and change it accordingly

```text
# MongoDB Address
MongoDBAddress = "mongodb://127.0.0.1/SensorPot"

# MongoDB Auth user
MongoUser = ""

# MongoDB Auth Password
MongoPassword = ""

# MongoDB Persistence for Aedes TTL packets(Number of seconds)
TTLPackets = 300
TTLSubscriptions = 300
```

The program initialise MongoDB Persistence as following:

```JavaScript
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
```

## Database Structure

The project will automatically create collections, the basic structure is:

* incoming
* outgoing
* pubsub
* retained
* subscriptions
* will

In this project, all payload published by users' sensors are stored in ```pubsub```. The example data is:

```json
{
  "_id": {
    "$oid": "6136e17df2b224393c2371a6"
  },
  "cmd": "publish",
  "brokerId": "SensorPotBroker",
  "brokerCounter": 4393,
  "topic": "publish",
  "payload": {
    "$binary": "eyJzZW5zb3JJRCI6InNfY2xpZW50OTAiLCJ0aW1lc3RhbXAiOiIxNjMwOTg2NTcwMzc2IiwicGF5bG9hZCI6eyJ0ZW1wZXJhdHVyZSI6ICIzMyJ9",
    "$type": "0"
  },
  "qos": 0,
  "retain": true,
  "dup": false,
  "added": {
    "$date": "2021-09-07T03:50:20.476Z"
  },
  "_stringId": "6136e17df2b224393c2371a6"
}
```

The payload of messages is stored as Binary, it should convert to string when reading In this case the binary of payload
can be converted to

```json
{
  "sensorID": "s_client90",
  "timestamp": "1630986570376",
  "payload": {
    "temperature": "33"
  }
}
```