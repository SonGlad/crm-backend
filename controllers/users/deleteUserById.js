const { ctrlWrapper, HttpError } = require("../../helpers/index");
const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { Leads } = require("../../models/externalLead");
const { AllCommentsSchema } = require("../../models/LeadsComments");
const { User } = require("../../models/MainUser");



const deleteUserById = async (req, res) =>{
    const { userId } = req.params;
    const { branch: reqBranch } = req.query;
    const {role: userRole, branch: userBranch} = req.user;
    const {role: authRole, branch: authBranch, id: authId} = req.auth;


    if (authRole !== userRole || authBranch !== userBranch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    let user;
    let assignedExternalOfficeLeads;
    let assignedOfficeLeads;
    let selfCreatedLeads;
    let allLeads;
    let userLeads;
    let mainUser;

    // ////////////////////////////////////////////////////////////
    // For Retention users the delete function has to be modified as retention leads will be located in another database cluster//////////
    // ///////////////////////////////////////////////////////////

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
            mainUser = await User.findById(authId);
            switch(reqBranch){
                case "Office1":
                    user = await Office1User.findById(userId);
                    if(["CRM Manager", "Conversion Manager", "Conversion Agent"].includes(user.role)){
                        assignedExternalOfficeLeads =  await Leads.find({ assignedOffice: "Office1" });
                        userLeads = assignedExternalOfficeLeads.filter(externalLead =>
                            externalLead.crmManager.email === user.email ||
                            externalLead.conManager.email === user.email ||
                            externalLead.conAgent.email === user.email
                        );
                        if(userLeads.length){
                            for (const externalLead of userLeads) {
                                if (externalLead.crmManager.email === user.email) {
                                    externalLead.crmManager = { name: "", email: "" };
                                }
                                if (externalLead.conManager.email === user.email) {
                                    externalLead.conManager = { name: "", email: "" };
                                }
                                if (externalLead.conAgent.email === user.email) {
                                    externalLead.conAgent = { name: "", email: "" };
                                }
                                await externalLead.save();
                            } 
                        }
                        
                        selfCreatedLeads = await Office1Leads.find({
                            selfCreated: true,
                            'owner.id': user._id
                        });
                        for (const officeLead of selfCreatedLeads) {
                            officeLead.selfCreated = false;
                            delete officeLead.owner;
                            await officeLead.save();
                        }

                        assignedOfficeLeads = await Office1Leads.find({
                            $or: [
                                { conManagerId: user._id },
                                { managerId: user._id },
                                { conAgentId: user._id }
                            ]
                        });

                        allLeads = selfCreatedLeads.concat(assignedOfficeLeads);

                        if(allLeads.length){
                            for (const officeLead of allLeads) {
                                const changes = [];
        
                                if (officeLead.conManagerId && officeLead.conManagerId.equals(user._id)) {
                                    officeLead.conManagerId = null;
                                    changes.push(`${user.role}`);
                                }
                                if (officeLead.managerId && officeLead.managerId.equals(user._id)) {
                                    officeLead.managerId = null;
                                    changes.push(`${user.role}`);
                                }
                                if (officeLead.conAgentId && officeLead.conAgentId.equals(user._id)) {
                                    officeLead.conAgentId = null;
                                    changes.push(`${user.role}`);
                                }
                                await officeLead.save();
        
        
                                if (changes.length > 0) {
                                    await AllCommentsSchema.create({
                                        ownerLeadId_office1: officeLead._id,
                                        createdBy: {
                                            username: mainUser.username,
                                            email: mainUser.email,
                                            branch: authBranch,
                                            role: authRole,
                                        },
                                        createdAt: Date.now(),
                                        comment: `User ${user.username} with email ${user.email} was removed. ${changes.join(', ')} was(were) reset by ${mainUser.username}`
                                    });
                                }
                            }
                        }
                        user = await Office1User.findByIdAndDelete(userId);
                    } else {
                        user = await Office1User.findByIdAndDelete(userId);
                    }
                break;


                case "Office2":
                    user = await Office2User.findById(userId);
                    if(["CRM Manager", "Conversion Manager", "Conversion Agent"].includes(user.role)){
                        assignedExternalOfficeLeads =  await Leads.find({ assignedOffice: "Office2" });
                        userLeads = assignedExternalOfficeLeads.filter(externalLead =>
                            externalLead.crmManager.email === user.email ||
                            externalLead.conManager.email === user.email ||
                            externalLead.conAgent.email === user.email
                        );
                        if(userLeads.length){
                            for (const externalLead of userLeads) {
                                if (externalLead.crmManager.email === user.email) {
                                    externalLead.crmManager = { name: "", email: "" };
                                }
                                if (externalLead.conManager.email === user.email) {
                                    externalLead.conManager = { name: "", email: "" };
                                }
                                if (externalLead.conAgent.email === user.email) {
                                    externalLead.conAgent = { name: "", email: "" };
                                }
                                await externalLead.save();
                            }
                        }
                        selfCreatedLeads = await Office2Leads.find({
                            selfCreated: true,
                            'owner.id': user._id
                        });
                        for (const officeLead of selfCreatedLeads) {
                            officeLead.selfCreated = false;
                            delete officeLead.owner;
                            await officeLead.save();
                        }

                        assignedOfficeLeads = await Office2Leads.find({
                            $or: [
                                { conManagerId: user._id },
                                { managerId: user._id },
                                { conAgentId: user._id }
                            ]
                        });

                        allLeads = selfCreatedLeads.concat(assignedOfficeLeads);

                        if(allLeads.length){
                            for (const officeLead of assignedOfficeLeads) {
                                const changes = [];
        
                                if (officeLead.conManagerId && officeLead.conManagerId.equals(user._id)) {
                                    officeLead.conManagerId = null;
                                    changes.push(`${user.role}`);
                                }
                                if (officeLead.managerId && officeLead.managerId.equals(user._id)) {
                                    officeLead.managerId = null;
                                    changes.push(`${user.role}`);
                                }
                                if (officeLead.conAgentId && officeLead.conAgentId.equals(user._id)) {
                                    officeLead.conAgentId = null;
                                    changes.push(`${user.role}`);
                                }
                                await officeLead.save();
        
        
                                if (changes.length > 0) {
                                    await AllCommentsSchema.create({
                                        ownerLeadId_office2: officeLead._id,
                                        createdBy: {
                                            username: mainUser.username,
                                            email: mainUser.email,
                                            branch: authBranch,
                                            role: authRole,
                                        },
                                        createdAt: Date.now(),
                                        comment: `User ${user.username} with email ${user.email} was removed. ${changes.join(', ')} was(were) reset by ${mainUser.username}`
                                    });
                                }
                            }
                        }
                        user = await Office2User.findByIdAndDelete(userId);
                    } else {
                        user = await Office2User.findByIdAndDelete(userId);
                    }
                break;


                default:
                    return res.status(400).send({ message: 'Invalid branch specified' }); 
            };
        break;


        default: 
            return res.status(400).send({ message: 'You are not athorized for this type of action' });
    };


    res.status(200).send({id: user._id, message: "User Deleted"});
};


module.exports = {
    deleteUserById: ctrlWrapper(deleteUserById),
};
