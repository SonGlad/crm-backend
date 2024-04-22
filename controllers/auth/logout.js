const { User } = require("../../models/MainUser");
const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");
const { ctrlWrapper } = require("../../helpers/index");
const { HttpError } = require("../../helpers/index");


const logout = async(req, res) => {
    const {_id} = req.user;
    const {branch} = req.auth;


    switch(branch){
        case 'Main':
            await User.findByIdAndUpdate(_id, { token: "" });
            break;
        case 'Office1':
            await Office1User.findByIdAndUpdate(_id, { token: "" });
            break;
        case 'Office2':
            await Office2User.findByIdAndUpdate(_id, { token: "" });
            break;
        default:
            throw HttpError(403, "You are not authorized for this type of action");
    }


    res.status(200).send({ message: "You have successfully logged out" });
};


module.exports = {
    logout: ctrlWrapper(logout)
};
