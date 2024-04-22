const express = require("express");
const router = express.Router();
const {
    validateBody, 
    validRegisterSchema,
    validLoginSchema,
    validUpdateUserInfoSchema, 
    authenticate, 
    updateAvatarM
} = require("../../middlewares/index");
const { MainUserSchemas }  = require("../../models/MainUser");

const { 
    extrenalRegister,
    internalRegister,
    verifyEmail,
    login,
    getCurrent,
    logout,
    updateAvatar,
    updateInfo,
    // resendVerifyEmail,
    // forgotPassword,
} = require("../../controllers/auth/index");


router.post("/exregister", validateBody(
    MainUserSchemas.registerSchema
), extrenalRegister.extrenalRegister);


router.post("/inregister", authenticate, validRegisterSchema, internalRegister.internalRegister);


router.get("/verify/:verificationToken", verifyEmail.verifyEmail);


router.post("/login", validLoginSchema, login.login);

    
router.get("/current", authenticate, getCurrent.getCurrent);


router.post("/logout", authenticate, logout.logout);


router.patch("/avatars", authenticate, updateAvatarM.single("avatarURL"), updateAvatar.updateAvatar);


router.put("/update", authenticate, validUpdateUserInfoSchema, updateInfo.updateInfo);

    
// router.post("/verify", validateBody(
//     schemas.verifySchema), resendVerifyEmail.resendVerifyEmail );
// router.post("/forgotPassword", validateBody(schemas.userResetPasswordSchema), forgotPassword.forgotPassword);



module.exports = router;