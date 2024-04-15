const express = require("express");


const router = express.Router();
const {validateBody, authenticate, updateAvatarM} = require("../../middlewares/index");
const  { schemas }  = require("../../models/user");
const { register,
    verifyEmail,
    resendVerifyEmail,
    login,
    getCurrent,
    logout,
    updateAvatar,
    updateInfo,
    forgotPassword,
} = require("../../controllers/auth/index")


router.post("/register", validateBody(
    schemas.registerSchema), register.register);

router.get("/verify/:verificationToken", verifyEmail.verifyEmail);

router.post("/verify", validateBody(
    schemas.verifySchema), resendVerifyEmail.resendVerifyEmail );

router.post("/login", validateBody(
    schemas.loginSchema), login.login);
    
router.get("/current", authenticate, getCurrent.getCurrent);

router.post("/logout", authenticate, logout.logout);

router.patch("/avatars", authenticate, updateAvatarM.single("avatarURL"), updateAvatar.updateAvatar);

router.put("/update", authenticate, validateBody(schemas.validateUpdateInfoSchema), updateInfo.updateInfo);

router.post("/forgotPassword", validateBody(schemas.userResetPasswordSchema), forgotPassword.forgotPassword);



module.exports = router;