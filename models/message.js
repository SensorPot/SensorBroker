const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    sensorID: String,
    timestamp: String,
    payload: String
});

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;
