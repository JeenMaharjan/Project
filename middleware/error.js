const ErrorHandler = require('../utils/errorHandler')

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal server failed"

    if (err.name === 'CastError') {
        const message = `resource not found. Invalid : ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 404)
    }

    if (err.name === "JsonWebTokenError") {
        const message = "jsonwebtoken is invalid"
        err = new ErrorHandler(message, 404)
    }

    if (err.name === "TokenExpiredError") {
        const message = "jsonweb token is expired"
        err = new ErrorHandler(message, 404)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}