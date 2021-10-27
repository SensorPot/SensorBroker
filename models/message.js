const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sensorID: Number,
    timestamp: Number,
    payload: String
});

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;
