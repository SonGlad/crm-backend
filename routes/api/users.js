const express = require("express");
const router = express.Router();
const {
    authenticate,
    isValidUserId,
    validVerifySchema, 
} = require("../../middlewares/index");
const {
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
} = require("../../controllers/users/index");



router.get("/office", authenticate, getOffice.getOffice);

router.get("/role", authenticate, getRole.getRole);

router.get("/all", authenticate, getAllUsers.getAllUsers);

router.get('/:userId', authenticate, isValidUserId, getUserById.getUserById);

router.get('/assignedLeads/:userId', authenticate, isValidUserId, getAssignedLeads.getAssignedLeads);

router.get('/selfCreatedLeads/:userId', authenticate, isValidUserId, getSelfCreatedLeads.getSelfCreatedLeads);

router.post("/verify/:userId", authenticate, isValidUserId, validVerifySchema, resendUserVerifyEmail.resendUserVerifyEmail);

router.get("/verify/:verificationToken", verifyUserEmail.verifyUserEmail);

router.post("/resetPassword/:userId", authenticate, isValidUserId, resetUserPassword.resetUserPassword);

router.delete("/:userId", authenticate, isValidUserId, deleteUserById.deleteUserById);


module.exports = router;







