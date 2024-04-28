const getOffice = require("./officeSelection");
const getRole = require("./roleSelection");
const getAllUsers = require("./getAllUsers");
const getUserById = require("./getUserById");
const resendUserVerifyEmail = require("./resendVerifyEmail");
const verifyUserEmail = require("./vefifyUserEmail");
const resetUserPassword = require("./resetUserPassword");
const deleteUserById = require("./deleteUserById");


module.exports ={
    getOffice,
    getRole,
    getAllUsers,
    getUserById,
    resendUserVerifyEmail,
    verifyUserEmail,
    resetUserPassword,
    deleteUserById,
};