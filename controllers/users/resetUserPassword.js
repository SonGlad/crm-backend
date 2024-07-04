const { ctrlWrapper, HttpError } = require("../../helpers/index");
const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");
const bcrypt = require("bcryptjs");


const resetUserPassword = async (req, res) => {
    const { userId } = req.params;
    const { branch: reqBranch } = req.query;
    const {role: userRole, branch: userBranch} = req.user;
    const {role: authRole, branch: authBranch} = req.auth;


    if (authRole !== userRole || authBranch !== userBranch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    let user;


    switch(authBranch){
        case "Main":
            switch(reqBranch){
                case "Office1":
                    user = await Office1User.findOne({ _id: userId});
                    break;
                case "Office2":
                    user = await Office2User.findOne({ _id: userId});
                    break;
                default:
                    return res.status(400).send({ message: 'Invalid branch specified' }); 
            };
            break;
        case "Office1":
            if (authRole === "CRM Manager"){
                user = await Office1User.findOne({ _id: userId});
            } else {
                return res.status(403).send({ message: "You are not authorized for this type of action"});
            }
            break;
        case "Office2":
            if(authRole === "CRM Manager"){
                user = await Office2User.findOne({ _id: userId});
            } else {
                return res.status(403).send({ message: "You are not authorized for this type of action"});
            }
            break;
        default: 
            return res.status(400).send({ message: 'Authorization branch is invalid' });
    };


    if (!user) {
        throw HttpError(404, "User not found");
    }

  
    const temporaryPassword = Math.random().toString(36).slice(-10);
    const hashedTemporaryPassword = await bcrypt.hash(temporaryPassword, 10);


    switch(authBranch){
        case "Main":
            switch(reqBranch){
                case "Office1":
                    user = await Office1User.findByIdAndUpdate(userId, { password: hashedTemporaryPassword });
                    break;
                case "Office2":
                    user = await Office2User.findByIdAndUpdate(userId, { password: hashedTemporaryPassword });
                    break;
                default:
                    return res.status(400).send({ message: 'Invalid branch specified' }); 
            };
            break;
        case "Office1":
            if(authRole === "CRM Manager"){
                user = await Office1User.findByIdAndUpdate(userId, { password: hashedTemporaryPassword });
            } else {
                return res.status(403).send({ message: "You are not authorized for this type of action"});
            }
            break;
        case "Office2":
            if(authRole === "CRM Manager"){
                user = await Office2User.findByIdAndUpdate(userId, { password: hashedTemporaryPassword });
            } else {
                return res.status(403).send({ message: "You are not authorized for this type of action"});
            }
            break;
        default: 
            return res.status(400).send({ message: 'Authorization branch is invalid' });
    };


  res.status(200).send({
    username: user.username,
    email: user.email,
    branch: user.branch,
    message: `User password successfully reset. New Password is: ${temporaryPassword}`
  });
};


module.exports = {
    resetUserPassword: ctrlWrapper(resetUserPassword),
};

