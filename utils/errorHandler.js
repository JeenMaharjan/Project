class ErrorHandler extends Error {

    constructor(message, statueCode) {
        super(message)
        this.statueCode = statueCode

        Error.captureStackTrace(this, this.constructor)
    }

}

module.exports = ErrorHandler