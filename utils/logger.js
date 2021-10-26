const logger = require('tracer').colorConsole({
    format: [
        '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})', //default format
        {
            error:
                '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}' // error format
        }
    ],
    dateformat: 'yyyy-mm-dd HH:MM:ss',
    preprocess: function (data) {
        data.title = data.title.toUpperCase()
    }
})

const showError = (message) => {
    logger.error(message)
}

const showWarning = (message) => {
    logger.warn(message)
}

const showInfo = (message) => {
    logger.info(message)
}

const showLog = (message) => {
    logger.log(message)
}

const showDebug = (message) => {
    logger.debug(message)
}

module.exports = {
    showInfo,
    showError,
    showDebug,
    showWarning,
    showLog
}
