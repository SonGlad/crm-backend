const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");
const { ctrlWrapper, HttpError } = require("../../helpers/index");


const getAvailableUsers = async (req, res) => {
    const {role, branch} = req.user;
    const {role: authRole, branch: authBranch} = req.auth;


    if (authRole !== role || authBranch !== branch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    let users;


    // ////////////////////////////////////////////////////////////
    // For Retention users the search function has to be changed//////////
    // ///////////////////////////////////////////////////////////



    switch(authBranch){
        case "Office1":
            switch(authRole){
                case "CRM Manager":
                    users = await Office1User.find({ role: "Conversion Manager", verify: true })
                    .select("_id username email");
                    break;
                case "Conversion Manager":
                    users = await Office1User.find({ role: "Conversion Agent", verify: true })
                    .select("_id username email");
                    break;
                default:
                    throw HttpError(403, "You are not authorized to get users information"); 
            };
            break;
        case "Office2":
            switch(authRole){
                case "CRM Manager":
                    users = await Office2User.find({ role: "Conversion Manager", verify: true })
                    .select("_id username email");
                    break;
                case "Conversion Manager":
                    users = await Office2User.find({ role: "Conversion Agent", verify: true })
                    .select("_id username email");
                    break;
                default:
                    throw HttpError(403, "You are not authorized to get users information"); 
            };
            break;
        default:
            return res.status(400).send({ message: 'Invalid branch specified' });
    };


    if(!users) {
        throw HttpError(404, "There are no users found");
    };


    res.status(200).send(users);
};


module.exports ={
    getAvailableUsers: ctrlWrapper(getAvailableUsers)
};