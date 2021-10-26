const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    sensorID: Number,
    timestamp: String,
    payload: String
});

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;
