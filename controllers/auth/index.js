const extrenalRegister = require("./externalRegister");
const internalRegister = require("./internalRegister");
const login = require("./login");
const getCurrent = require("./getCurrent");
const logout = require("./logout");
const updateAvatar = require("./updateAvatar");
const verifyEmail = require("./verifyEmail");
// const resendVerifyEmail = require("../resendVerifyEmail");
// const forgotPassword = require("./forgotPassword");
const updateInfo = require("./update")


module.exports = {
    extrenalRegister,
    internalRegister,
    login,
    getCurrent,
    logout,
    updateAvatar,
    verifyEmail,
    // resendVerifyEmail,
    // forgotPassword,
    updateInfo
};