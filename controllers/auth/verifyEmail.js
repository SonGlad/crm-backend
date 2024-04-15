const {ctrlWrapper, HttpError} = require("../../helpers/index");
const { User } = require("../../models/user");
 

const verifyEmail = async(req, res) => {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});

    if(!user) {
        throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ""});

    res.status(200).send({ message: 'Verification successful'});
};


module.exports = {
    verifyEmail: ctrlWrapper(verifyEmail)
};