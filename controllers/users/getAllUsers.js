const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { ctrlWrapper, HttpError } = require("../../helpers/index");


const getAllUsers = async (req, res) => {
    const {role, branch} = req.user;
    const {role: authRole, branch: authBranch} = req.auth;
    const { branch: reqBranch } = req.params;


    if (authRole !== role || authBranch !== branch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    let preUsers;
    let leadsModel
    let users;


    // ////////////////////////////////////////////////////////////
    // For Retention users the search function has to be changed as retention leads will be located in another database cluster//////////
    // ///////////////////////////////////////////////////////////


    const getUsersWithLeadsCount = async (users, leadsModel) => {
        const userPromises = preUsers.map(async (user) => {
            const assignedLeads = await leadsModel.find({
                $or: [
                    { managerId: user._id },
                    { conManagerId: user._id },
                    { conAgentId: user._id }
                ]
            }).countDocuments();
    
            const selfCreatedLeads = await leadsModel.find({
                'owner.id': user._id
            }).countDocuments();
    
            return {
                ...user.toObject(),
                totalLeads: assignedLeads + selfCreatedLeads
            };
        });

        return await Promise.all(userPromises);
    };


    switch(authBranch){
        case "Main":
            if(authRole === "Developer" || authRole === "Administrator" || authRole === "Manager"){
                switch (reqBranch) {
                    case 'Office1':
                        preUsers = await Office1User.find().select("username email role branch createdAt verify");
                        leadsModel = Office1Leads;
                        break;
                    case 'Office2':
                        preUsers = await Office2User.find().select("username email role branch createdAt verify");
                        leadsModel = Office2Leads;
                        break;
                    default:
                        return res.status(400).send({ message: 'Invalid branch specified' });
                };
                users = await getUsersWithLeadsCount(preUsers, leadsModel);
            }
            break;
        case "Office1":
            switch(authRole){
                case "CRM Manager":
                    preUsers = await Office1User.find({ role: { $ne: "CRM Manager" }})
                    .select("username email role branch createdAt verify");
                    leadsModel = Office1Leads;
                    break;
                case "Conversion Manager":
                    preUsers = await Office1User.find({ role: { $nin: ["CRM Manager", "Conversion Manager", "Retention Manager", "Retention Agent"]}})
                    .select("username email role branch createdAt verify");
                    leadsModel = Office1Leads;
                    break;
                case "Retention Manager":
                    preUsers = await Office1User.find({ role: { $nin: ["CRM Manager", "Retention Manager", "Conversion Manager", "Conversion Agent"]}})
                    .select("username email role branch createdAt verify");
                    leadsModel = Office1Leads;
                    break;
                default:
                    throw HttpError(403, "You are not authorized to check the users"); 
            };
            users = await getUsersWithLeadsCount(preUsers, leadsModel);
            break;
        case "Office2":
            switch(authRole){
                case "CRM Manager":
                    preUsers = await Office2User.find({ role: { $ne: "CRM Manager" }})
                    .select("username email role branch createdAt verify");
                    leadsModel = Office2Leads;
                    break;
                case "Conversion Manager":
                    preUsers = await Office2User.find({ role: { $nin: ["CRM Manager", "Conversion Manager", "Retention Manager", "Retention Agent"]}})
                    .select("username email role branch createdAt verify");
                    leadsModel = Office2Leads;
                    break;
                case "Retention Manager":
                    preUsers = await Office2User.find({ role: { $nin: ["CRM Manager", "Retention Manager", "Conversion Manager", "Conversion Agent"]}})
                    .select("username email role branch createdAt verify");
                    leadsModel = Office2Leads;
                    break;
                default:
                    throw HttpError(403, "You are not authorized to check the users"); 
            };
            users = await getUsersWithLeadsCount(preUsers, leadsModel);
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