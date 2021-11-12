const logger = require("../utils/logger");
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
        cors: {
            origin: process.env.socketCORSAddress,
            methods: ["GET", "POST"]
        }
    }
);

io.on("connection", (socket) => {
    logger.showLog("Socket.io: [EVENT=connection] New client connected.");
    socket.on('disconnect', function () {
        logger.showLog("Socket.io: [EVENT=disconnect] client has disconnected.");
    });
    //logger.showDebug(socket)
});
httpServer.listen(process.env.socketPost);

logger.showInfo('Socket.io initialised. Port: ' + process.env.socketPost);

module.exports = io;