const getOffice = require("./officeSelection");
const getRole = require("./roleSelection");
const getAllUsers = require("./getAllUsers");
const getUserById = require("./getUserById");
const getSelfCreatedLeads = require("./getSelfCreatedLeads");
const getAssignedLeads = require("./getAssignedLeads");
const resendUserVerifyEmail = require("./resendVerifyEmail");
const verifyUserEmail = require("./vefifyUserEmail");
const resetUserPassword = require("./resetUserPassword");
const deleteUserById = require("./deleteUserById");


module.exports ={
    getOffice,
    getRole,
    getAllUsers,
    getUserById,
    getSelfCreatedLeads,
    getAssignedLeads,
    resendUserVerifyEmail,
    verifyUserEmail,
    resetUserPassword,
    deleteUserById,
};