const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken")
const catchasyncError = require("./catchasyncError");

exports.isAuthenticatedUser = catchasyncError(async(req, res, next) => {
    const { token } = req.cookies || req.cookies.access_token;

    if (!token) {
        return next(new ErrorHandler("Please Login to access this resourceee", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT);

    req.user = await User.findById(decodedData.id);

    next();
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role : ${req.user.role} is not allowed to accesses this resource`, 403))
        }
        next()
    }
}