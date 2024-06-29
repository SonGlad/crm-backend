const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { ctrlWrapper, HttpError } = require("../../helpers/index");


const getUserById = async(req, res) => {
    const { userId } = req.params;
    const { branch: reqBranch } = req.query;
    const {role, branch} = req.user;
    const {role: authRole, branch: authBranch} = req.auth;

    
    if (authRole !== role || authBranch !== branch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    let selfCreatedLeads;
    let assignedLeads;
    let userInfo;


    switch(authBranch){
        case "Main":
            switch (reqBranch) {
                case 'Office1':
                    selfCreatedLeads = await Office1Leads.find({'owner.id': userId});
                    assignedLeads = await Office1Leads.find({    
                        $or: [
                        { managerId: userId },
                        { conManagerId: userId },
                        { conAgentId: userId }
                    ]});
                    userInfo = await Office1User.findOne({ _id: userId})
                    .select("-password -token -avatarURL -verificationToken");
                    break;
                case 'Office2':
                    selfCreatedLeads = await Office2Leads.find({'owner.id': userId});
                    assignedLeads = await Office2Leads.find({    
                        $or: [
                        { managerId: userId },
                        { conManagerId: userId },
                        { conAgentId: userId }
                    ]});
                    userInfo = await Office2User.findOne({ _id: userId})
                    .select("-password -token -avatarURL -verificationToken");
                    break;
                default:
                    return res.status(400).send({ message: 'Invalid branch specified' });
            };
            break;
        case "Office1":
            selfCreatedLeads = await Office1Leads.find({'owner.id': userId});
            assignedLeads = await Office1Leads.find({    
                $or: [
                { managerId: userId },
                { conManagerId: userId },
                { conAgentId: userId }
            ]});
            userInfo = await Office1User.findOne({ _id: userId})
            .select("-password -token -avatarURL -verificationToken");
            break;
        case "Office2":
            selfCreatedLeads = await Office2Leads.find({'owner.id': userId});
            assignedLeads = await Office2Leads.find({    
                $or: [
                { managerId: userId },
                { conManagerId: userId },
                { conAgentId: userId }
            ]});
            userInfo = await Office2User.findOne({ _id: userId})
            .select("-password -token -avatarURL -verificationToken");
            break;
        default: 
            return res.status(400).send({ message: 'Authorization branch is invalid' });
    };


    if(!userInfo) {
        throw HttpError(404, "User was not found");
    };


    const user = userInfo.toObject();
    user.leads = {
        selfCreated: selfCreatedLeads.length,
        assigned: assignedLeads.length
    };


    res.status(200).send(user);
};


module.exports ={
    getUserById: ctrlWrapper(getUserById)
};

