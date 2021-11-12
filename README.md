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

## Aedes Events

By current design, AEDES only listen on those events:

* client - Client Connected
* clientDisconnect - Client Disconnected
* publish - Client published message

To config an event listener, use the following syntax:
`aedes.on('event', function (client) { });`

## Overall Configuration

Copy ```env``` to ```.env``` and change it accordingly

```text
# Broker Port
BrokerNetPort = 1883
BrokerTlsPort = 8883

# Broker Certification
KeyFile = ""
CertFile = ""

# MongoDB Configuration
# MongoDB Address
MongoDBAddress= "mongodb://127.0.0.1/Mini_Twins"

# MongoDB Auth user
MongoDBUser = ""

# MongoDB Auth Password
MongoDBPassword = ""

# Mongoose Configuration
MG_autoIndex = false
MG_minPoolSize = 100
MG_maxPoolSize = 1000
MG_socketTimeoutMS = 30000
MG_family = 4
MG_serverSelectionTimeoutMS = 5000
MG_heartbeatFrequencyMS = 30000

# MongoDB Persistence for Aedes TTL packets (Number of seconds)
TTLPackets = 300
TTLSubscriptions = 300

# AEDES Configuration
# Concurrency: Number of Concurrent connections
# MqEmitter and Persistence: Used for Aedes Server clusters
# If Enable MqEmitter and Persistence, the message will be store in MongoDB by default Persistence + Emitter standard.
# Documents are stored in /pubsub collection
concurrency = 10000
UseMqEmitter = false
UsePersistence = false

# SOCKET.IO Configuration
socketPost = 33333
socketCORSAddress = "http://localhost:3000"
```


## MongoDB Persistence

For multiple server instance plus multiple databases (AKA large scale), the program can initialise **MongoDB Persistence** as following:

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

The project will automatically create collections **if user enable MQEmitter and Mongo Persistence**, the basic
structure is:

* incoming
* outgoing
* pubsub
* retained
* subscriptions
* will

In this project, if user enable **MQEmitter**, all payload published by users' sensors are stored in ```pubsub```. The
example data is:

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

If user disable **MQEmitter**, broker will store all the message into MongoDB with following **Mongoose schema**
directly. The message schema has SensorID, GroupID, Timestamp and payload

```js
const messageSchema = new mongoose.Schema({
    sensorID: Number,
    groupID: Number,
    timestamp: String,
    payload: String
});
```

## Socket.IO and related details

When app.js initialised, the system will create a Socket.IO instance by execute

```js
const io = require("socket.io")(httpServer, {
        cors: {
            origin: process.env.socketCORSAddress,
            methods: ["GET", "POST"]
        }
    }
);
```

When users (mainly browsers currently) connected to this server,
The server will then send socket message (one message for one group) to them every 1 second. (just few KB in size)

**The cors address (env.socketCORSAddress) need correct configured before start the server.** Otherwise the clients will keep getting CORS warning with no data attached.