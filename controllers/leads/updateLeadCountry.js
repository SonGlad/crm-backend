const { ctrlWrapper, HttpError } = require("../../helpers/index");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { AllCommentsSchema } = require("../../models/LeadsComments");
const { User } = require("../../models/MainUser");
const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");


const updateLeadCountry = async(req, res) => {
    const { leadId } = req.params;
    const { country: bodyCountry } = req.body;
    const {role: userRole, branch: userBranch,} = req.user;
    const {role: authRole, branch: authBranch, id: authId} = req.auth;


    if (authRole !== userRole || authBranch !== userBranch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    let lead;
    let user;
    let prevLead;
    let updatedLead;



    switch(authBranch){
        case "Main":
            lead = await Office1Leads.findOne({_id: leadId});
            if(!lead){
                lead = await Office2Leads.findOne({_id: leadId})
            }
            if(!lead || !lead.branch){
                return res.status(400).send({ message: "Lead not found or branch not specified in lead"});
            }
            user = await User.findOne({_id: authId});
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }
            switch(lead.branch){
                case "Office1":
                    prevLead = await Office1Leads.findOne({_id: leadId});
                    if (!prevLead){
                        return res.status(404).send({ message: 'Lead not found' });
                    }
                    updatedLead = await Office1Leads.findOneAndUpdate({_id: leadId}, {
                        country: bodyCountry,
                        latestComment: {
                            createdBy: {
                                username: user.username,
                                email: user.email,
                                branch: authBranch,
                                role: authRole,
                            },
                            createdAt: Date.now(),
                            comment: `The lead country was changed from ${prevLead.country} to ${bodyCountry} by the user ${user.username}`
                        } 
                    }, { new: true });
                    await AllCommentsSchema.create({
                        ownerLeadId_office1: lead._id,
                        createdBy: {
                            username: user.username,
                            email: user.email,
                            branch: authBranch,
                            role: authRole,
                        },
                        createdAt: Date.now(),
                        comment: `The lead country was changed from ${prevLead.country} to ${bodyCountry} by user ${user.username}`
                    });
                    break;


                case "Office2":
                    prevLead = await Office2Leads.findOne({_id: leadId});
                    if (!prevLead){
                        return res.status(404).send({ message: 'Lead not found' });
                    }
                    updatedLead = await Office2Leads.findOneAndUpdate({_id: leadId}, {
                        country: bodyCountry,
                        latestComment: {
                            createdBy: {
                                username: user.username,
                                email: user.email,
                                branch: authBranch,
                                role: authRole,
                            },
                            createdAt: Date.now(),
                            comment: `The lead country was changed from ${prevLead.country} to ${bodyCountry} by user ${user.username}`
                        } 
                    }, { new: true });
                    await AllCommentsSchema.create({
                        ownerLeadId_office2: lead._id,
                        createdBy: {
                            username: user.username,
                            email: user.email,
                            branch: authBranch,
                            role: authRole,
                        },
                        createdAt: Date.now(),
                        comment: `The lead country was changed from ${prevLead.country} to ${bodyCountry} by the user ${user.username}`
                    });
                    break;
                default:
                    return res.status(400).send({ message: "Lead branch not specified in lead"});
            };
            break;


        case "Office1":
            user = await Office1User.findOne({_id: authId});
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }
            prevLead = await Office1Leads.findOne({_id: leadId});
            if (!prevLead){
                return res.status(404).send({ message: 'Lead not found' });
            }
            updatedLead = await Office1Leads.findOneAndUpdate({_id: leadId}, {
                country: bodyCountry,
                latestComment: {
                    createdBy: {
                        username: user.username,
                        email: user.email,
                        branch: authBranch,
                        role: authRole,
                    },
                    createdAt: Date.now(),
                    comment: `The lead country was changed from ${prevLead.country} to ${bodyCountry} by the user ${user.username}`
                } 
            }, { new: true });
            await AllCommentsSchema.create({
                ownerLeadId_office1: lead._id,
                createdBy: {
                    username: user.username,
                    email: user.email,
                    branch: authBranch,
                    role: authRole,
                },
                createdAt: Date.now(),
                comment: `The lead country was changed from ${prevLead.country} to ${bodyCountry} by user ${user.username}`
            });
            break;


        case "Office2":
            user = await Office2User.findOne({_id: authId});
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }
            prevLead = await Office2Leads.findOne({_id: leadId});
            if (!prevLead){
                return res.status(404).send({ message: 'Lead not found' });
            }
            updatedLead = await Office2Leads.findOneAndUpdate({_id: leadId}, {
                country: bodyCountry,
                latestComment: {
                    createdBy: {
                        username: user.username,
                        email: user.email,
                        branch: authBranch,
                        role: authRole,
                    },
                    createdAt: Date.now(),
                    comment: `The lead country was changed from ${prevLead.country} to ${bodyCountry} by user ${user.username}`
                } 
            }, { new: true });
            await AllCommentsSchema.create({
                ownerLeadId_office2: lead._id,
                createdBy: {
                    username: user.username,
                    email: user.email,
                    branch: authBranch,
                    role: authRole,
                },
                createdAt: Date.now(),
                comment: `The lead country was changed from ${prevLead.country} to ${bodyCountry} by the user ${user.username}`
            });
            break;
        default:
            return res.status(400).send({ message: 'Authorization branch is invalid' });
    };


    
    if (!updatedLead) {
        throw HttpError(404, "Lead was not found");
    };


    res.status(200).send(updatedLead);
};


module.exports = {
    updateLeadCountry : ctrlWrapper(updateLeadCountry )
};