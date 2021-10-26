const mongoose = require("mongoose");
const {mongoDBAddress, mongoOptions} = require("../config/mongoConfig");
const logger = require("../utils/logger");

mongoose.connect(mongoDBAddress, mongoOptions, function (err, res) {
    if (err) {
        logger.showError('Database connect error: ' + err.message);
    } else {
        logger.showInfo('Database connected.');
    }
});

module.exports = mongoose;
