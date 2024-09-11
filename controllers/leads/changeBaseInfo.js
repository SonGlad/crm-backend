const { ctrlWrapper, HttpError } = require("../../helpers/index");
const { Leads } = require("../../models/externalLead");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { AllCommentsSchema } = require("../../models/LeadsComments");
const { User } = require("../../models/MainUser");
const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");



const changeBaseInfo = async(req, res) => {
    const { name: bodyName, lastName: bodyLastName, email: bodyEmail, phone: bodyPhone } = req.body;
    const { leadId } = req.params;
    const {role: userRole, branch: userBranch,} = req.user;
    const {role: authRole, branch: authBranch, id: authId} = req.auth;


    if (authRole !== userRole || authBranch !== userBranch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    let updatedExternalLead;
    let updatedOfficeLead;
    let branchLead;
    let branchLeadId;
    let mainUser;
    let officeUser;
    let lead;


    const getChanges = (lead, bodyName, bodyLastName, bodyEmail, bodyPhone) => {
        const changes = [];
        if (lead.name !== bodyName) {
            changes.push(`Lead name was changed from ${lead.name} to ${bodyName}`);
        }
        if (lead.lastName !== bodyLastName) {
            changes.push(`Lead surname was changed from ${lead.lastName} to ${bodyLastName}`);
        }
        if (lead.email !== bodyEmail) {
            changes.push(`Lead email was changed from ${lead.email} to ${bodyEmail}`);
        }
        if (lead.phone !== bodyPhone) {
            changes.push(`Lead phone was changed from ${lead.phone} to ${bodyPhone}`);
        }
        return changes;
    };
    

    switch(authBranch){
        case "Main":
            branchLead = await Leads.findOne({_id: leadId});
            if (!branchLead) {
                return res.status(404).send({ message: 'Lead not found' });
            }
            branchLeadId = branchLead.assignedOffice;
            if(branchLeadId === "Not Assigned"){
                updatedExternalLead = await Leads.findOneAndUpdate({ _id: leadId}, {
                    name: bodyName, lastName: bodyLastName, email: bodyEmail, phone: bodyPhone
                }, { new: true });
            } else {
                updatedExternalLead = await Leads.findOneAndUpdate({ _id: leadId}, {
                    name: bodyName, lastName: bodyLastName, email: bodyEmail, phone: bodyPhone
                }, { new: true });


                switch(branchLeadId){
                    case "Office1": {
                        mainUser = await User.findOne({_id: authId});
                        if (!mainUser) {
                            return res.status(404).send({ message: 'Main User not found' });
                        }
                        lead = await Office1Leads.findOne({externalLeadId: leadId});
                        if (!lead) {
                            return res.status(404).send({ message: 'Office1 lead not found' });
                        }
                        const changesOffice1 = getChanges(lead, bodyName, bodyLastName, bodyEmail, bodyPhone);
                        if(changesOffice1.length > 0){
                            await Office1Leads.findOneAndUpdate({externalLeadId: leadId}, {
                                name: bodyName, lastName: bodyLastName, email: bodyEmail, phone: bodyPhone,
                                latestComment: {
                                    createdBy: {
                                        username: mainUser.username,
                                        email: mainUser.email,
                                        branch: authBranch,
                                        role: authRole,
                                    },
                                    createdAt: Date.now(),
                                    comment: `${changesOffice1.join('. ')} was(were) changed by the user ${mainUser.username}`
                                } 
                            }, { new: true });
                        };
                        await AllCommentsSchema.create({
                            ownerLeadId_office1: lead._id,
                            createdBy: {
                                username: mainUser.username,
                                email: mainUser.email,
                                branch: authBranch,
                                role: authRole,
                            },
                            createdAt: Date.now(),
                            comment: `${changesOffice1.join('. ')} was(were) changed by the user ${mainUser.username}`
                        });
                        break;
                    };


                    case "Office2": {
                        mainUser = await User.findOne({_id: authId});
                        if (!mainUser) {
                            return res.status(404).send({ message: 'Main User not found' });
                        }
                        lead = await Office2Leads.findOne({externalLeadId: leadId});
                        if (!lead) {
                            return res.status(404).send({ message: 'Office2 lead not found' });
                        }
                        const changesOffice2 = getChanges(lead, bodyName, bodyLastName, bodyEmail, bodyPhone);
                        if(changesOffice2.length > 0){
                            await Office2Leads.findOneAndUpdate({externalLeadId: leadId}, {
                                name: bodyName, lastName: bodyLastName, email: bodyEmail, phone: bodyPhone,
                                latestComment: {
                                    createdBy: {
                                        username: mainUser.username,
                                        email: mainUser.email,
                                        branch: authBranch,
                                        role: authRole,
                                    },
                                    createdAt: Date.now(),
                                    comment: `${changesOffice2.join('. ')} was(were) changed by the user ${mainUser.username}`
                                } 
                            }, { new: true });
                        };
                        await AllCommentsSchema.create({
                            ownerLeadId_office2: lead._id,
                            createdBy: {
                                username: mainUser.username,
                                email: mainUser.email,
                                branch: authBranch,
                                role: authRole,
                            },
                            createdAt: Date.now(),
                            comment: `${changesOffice2.join('. ')} was(were) changed by the user ${mainUser.username}`
                        });
                        break;
                    };
                    default:
                        return res.status(400).send({ message: 'Such assigned Office branch is not valid' });
                };
            };
            break;


        case "Office1": 
            officeUser = await Office1User.findOne({_id: authId});
            if (!officeUser) {
                return res.status(404).send({ message: 'Office 1 User not found' });
            }
            lead = await Office1Leads.findOne({_id: leadId});
            if (!lead) {
                return res.status(404).send({ message: 'Lead not found' });
            }
            if (lead.selfCreated !== true) {
                return res.status(403).send({message: 'You are not authorized for this type of action'})
            } else {
                if(lead.selfCreated === true && lead.owner.id.toString() !== authId){
                    return res.status(403).send({message: 'You have no rights to make such changes in lead wich is not created by you'})
                } else {
                    const changesOffice1Self = getChanges(lead, bodyName, bodyLastName, bodyEmail, bodyPhone);
                    if(changesOffice1Self.length > 0){
                        updatedOfficeLead = await Office1Leads.findOneAndUpdate({_id: leadId}, {
                            name: bodyName, lastName: bodyLastName, email: bodyEmail, phone: bodyPhone,
                            latestComment: {
                                createdBy: {
                                    username: officeUser.username,
                                    email: officeUser.email,
                                    branch: authBranch,
                                    role: authRole,
                                },
                                createdAt: Date.now(),
                                comment: `${changesOffice1Self.join('. ')} was(were) changed by the user ${officeUser.username}`
                            } 
                        }, { new: true });
                    };
                    await AllCommentsSchema.create({
                        ownerLeadId_office1: lead._id,
                        createdBy: {
                            username: officeUser.username,
                            email: officeUser.email,
                            branch: authBranch,
                            role: authRole,
                        },
                        createdAt: Date.now(),
                        comment: `${changesOffice1Self.join('. ')} was(were) changed by the user ${officeUser.username}`
                    });
                };
            };
            break;


        case "Office2":
            officeUser = await Office2User.findOne({_id: authId});
            if (!officeUser) {
                return res.status(404).send({ message: 'Office 2 User not found' });
            }
            lead = await Office2Leads.findOne({_id: leadId});
            if (!lead) {
                return res.status(404).send({ message: 'Lead not found' });
            }
            if (lead.selfCreated !== true) {
                return res.status(403).send({message: 'You are not authorized for this type of action'})
            } else {
                if(lead.selfCreated === true && lead.owner.id.toString() !== authId){
                    return res.status(403).send({message: 'You have no rights to make such changes in lead wich is not created by you'})
                } else {
                    const changesOffice2Self = getChanges(lead, bodyName, bodyLastName, bodyEmail, bodyPhone);
                    if(changesOffice2Self.length > 0){
                        updatedOfficeLead = await Office2Leads.findOneAndUpdate({_id: leadId}, {
                            name: bodyName, lastName: bodyLastName, email: bodyEmail, phone: bodyPhone,
                            latestComment: {
                                createdBy: {
                                    username: officeUser.username,
                                    email: officeUser.email,
                                    branch: authBranch,
                                    role: authRole,
                                },
                                createdAt: Date.now(),
                                comment: `${changesOffice2Self.join('. ')} was(were) changed by the user ${officeUser.username}`
                            } 
                        }, { new: true });
                    };
                    await AllCommentsSchema.create({
                        ownerLeadId_office2: lead._id,
                        createdBy: {
                            username: officeUser.username,
                            email: officeUser.email,
                            branch: authBranch,
                            role: authRole,
                        },
                        createdAt: Date.now(),
                        comment: `${changesOffice2Self.join('. ')} was(were) changed by the user ${officeUser.username}`
                    });
                }
            };
            break;
        default:
            return res.status(400).send({ message: 'Authorization branch is invalid' });
    };



    if (!updatedExternalLead && !updatedOfficeLead) {
        throw HttpError(404, "Lead was not found");
    };


    switch(authBranch){
        case "Main":
            res.status(200).send(updatedExternalLead);
            break;
        default:
            res.status(200).send(updatedOfficeLead);
    };
};


module.exports = {
    changeBaseInfo: ctrlWrapper(changeBaseInfo)
};