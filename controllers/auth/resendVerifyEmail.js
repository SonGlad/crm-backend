const {ctrlWrapper, HttpError, sendEmail} = require("../../helpers/index");
const { User } = require("../../models/user");
require("dotenv").config();


const {BASE_URL} = process.env;


const resendVerifyEmail = async(req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});

    if(!user) {
        throw HttpError(404, "Email, not found");
    }

    if(user.verify){
        throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify email</a>`
    }
    await sendEmail(verifyEmail);

    res.status(200).send({message: "Verify email send"});
};


module.exports = {
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail)
};