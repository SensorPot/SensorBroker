require('dotenv').config()

//Initial MongoDB Service
require('./services/mongoService');

//Initial Socket.IO Service
require('./services/socketService');

//Initial Aedes Broker Service
require('./services/brokerService');
