const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");
const { ctrlWrapper, HttpError } = require("../../helpers/index");


const getAllUsers = async (req, res) => {
    const {role, branch} = req.user;
    const {role: authRole, branch: authBranch} = req.auth;
    const { branch: reqBranch } = req.params;


    if (authRole !== role || authBranch !== branch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    let users;


    switch(authBranch){
        case "Main":
            if(authRole === "Developer" || authRole === "Administrator" || authRole === "Manager"){
                switch (reqBranch) {
                    case 'Office1':
                        users = await Office1User.find().select("username email role branch createdAt");
                        break;
                    case 'Office2':
                        users = await Office2User.find().select("username email role branch createdAt");
                        break;
                    default:
                        return res.status(400).send({ message: 'Invalid branch specified' });
                };
            }
            break;
        case "Office1":
            switch(authRole){
                case "CRM Manager":
                    users = await Office1User.find({ role: { $ne: "CRM Manager" }})
                    .select("username email role branch createdAt");
                    break;
                case "Conversion Manager":
                    users = await Office1User.find({ role: { $nin: ["CRM Manager", "Conversion Manager", "Retention Manager", "Retention Agent"]}})
                    .select("username email role branch createdAt");
                    break;
                case "Retention Manager":
                    users = await Office1User.find({ role: { $nin: ["CRM Manager", "Retention Manager", "Conversion Manager", "Conversion Agent"]}})
                    .select("username email role branch createdAt");
                    break;
                default:
                    throw HttpError(403, "You are not authorized to check the users"); 
            };
            break;
        case "Office2":
            switch(authRole){
                case "CRM Manager":
                    users = await Office2User.find({ role: { $ne: "CRM Manager" }})
                    .select("username email role branch createdAt");
                    break;
                case "Conversion Manager":
                    users = await Office2User.find({ role: { $nin: ["CRM Manager", "Conversion Manager", "Retention Manager", "Retention Agent"]}})
                    .select("username email role branch createdAt");
                    break;
                case "Retention Manager":
                    users = await Office2User.find({ role: { $nin: ["CRM Manager", "Retention Manager", "Conversion Manager", "Conversion Agent"]}})
                    .select("username email role branch createdAt");
                    break;
                default:
                    throw HttpError(403, "You are not authorized to check the users"); 
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
    getAllUsers: ctrlWrapper(getAllUsers)
};