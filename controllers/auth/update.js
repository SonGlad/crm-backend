const {ctrlWrapper, HttpError} = require("../../helpers/index");
const bcrypt = require("bcryptjs");
const { User } = require("../../models/MainUser");
const { Office1User } = require ("../../models/Office1User");
const { Office2User } = require ("../../models/Office2User");


const updateInfo = async(req, res) => {
    const { password, newPassword } = req.body;
    const {role: authRole, branch: authBranch} = req.auth;
    const { _id: userId, role, branch } = req.user;


    let user;
    

    if (authRole !== role || authBranch !== branch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    switch(authBranch){
        case 'Main':
            user = await User.findById(userId);
            if(user){
                await passwordCompare(res, user, password, newPassword);
                return;
            };
            break;
        case 'Office1':
            user = await Office1User.findById(userId);
            if(user){
                await passwordCompare(res, user, password, newPassword);
                return;
            };
            break;
        case 'Office2':
            user = await Office2User.findById(userId);
            if(user){
                await passwordCompare(res, user, password, newPassword);
                return;
            };
            break;
        default:
            throw HttpError(400, "Invalid branch provided");
    }


    throw HttpError(401, "User not found");

};


const passwordCompare = async (res, user, password, newPassword) => {
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
        throw HttpError(401, "Current password invalid");
    }


    if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
    }


    await user.save();

    res.send({ message: "Your password has been successfully updated" });
}


module.exports = {
    updateInfo: ctrlWrapper(updateInfo)
};