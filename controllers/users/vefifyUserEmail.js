const {ctrlWrapper, HttpError} = require("../../helpers/index");
const { User } = require("../../models/MainUser");
const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");

 

const verifyUserEmail = async(req, res) => {
    const { verificationToken } = req.params;

    
    let user;


    user = await User.findOne({verificationToken});
    if (user) {
        await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });
        return res.status(200).send({ message: 'Verification successful' });
    };


    user = await Office1User.findOne({ verificationToken });
    if (user) {
        await Office1User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });
        return res.status(200).send({ message: 'Verification successful' });
    };


    user = await Office2User.findOne({ verificationToken });
    if (user) {
        await Office2User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });
        return res.status(200).send({ message: 'Verification successful' });
    };
    

    throw HttpError(404, "User not found");
};


module.exports = {
    verifyUserEmail: ctrlWrapper(verifyUserEmail)
};