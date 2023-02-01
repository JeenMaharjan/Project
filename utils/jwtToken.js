const cookie = require("cookie-universal")
const sendToken = (user, statusCode, res) => {



    // options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_DATE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    const token = user.getJWTToken();
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token,

    });
};

module.exports = sendToken;