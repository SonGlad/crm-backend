const { ctrlWrapper, HttpError } = require("../../helpers/index");
const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");


const deleteUserById = async (req, res) =>{
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
        default: 
            return res.status(400).send({ message: 'You are not athorized for this type of action' });
    };


    if (!user) {
        throw HttpError(404, "User not found");
    }


    switch(authBranch){
        case "Main":
            switch(reqBranch){
                case "Office1":
                    user = await Office1User.findOneAndDelete({ _id: userId});
                    break;
                case "Office2":
                    user = await Office2User.findOneAndDelete({ _id: userId});
                    break;
                default:
                    return res.status(400).send({ message: 'Invalid branch specified' }); 
            };
            break;
        default: 
            return res.status(400).send({ message: 'You are not athorized for this type of action' });
    };


    res.status(200).send({id: user._id, message: "Contact Deleted"});
};


module.exports = {
    deleteUserById: ctrlWrapper(deleteUserById),
};
