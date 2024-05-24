const { ctrlWrapper, HttpError } = require("../../helpers/index");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { AllCommentsSchema } = require("../../models/LeadsComments");
const { User } = require("../../models/MainUser");
const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");


const updateLeadKYC = async (req, res) => {
    const { leadId } = req.params;
    const { KYC : {
        trading: bodyTrading, 
        expirience: bodyExpirience, 
        investment: bodyInvestment, 
        time: bodyTime, 
        riskTolerance: bodyRiskTolerance,
        profitGoal: bodyProfitGoal
    }} = req.body;
    const {role: userRole, branch: userBranch,} = req.user;
    const {role: authRole, branch: authBranch, id: authId} = req.auth;


    if (authRole !== userRole || authBranch !== userBranch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    let lead;
    let prevLead;
    let updatedLead;
    let user;


    const getChanges = (prevLead, bodyTrading, bodyExpirience, bodyInvestment, bodyTime, bodyRiskTolerance, bodyProfitGoal) => {
        const changes = [];
        if (prevLead.KYC.trading !== bodyTrading) {
            changes.push(`Lead expirience in trading was changed from ${prevLead.KYC.trading} to ${bodyTrading}`);
        }
        if (prevLead.KYC.expirience !== bodyExpirience) {
            changes.push(`Lead trading expirience was changed from ${prevLead.KYC.expirience} to ${bodyExpirience}`);
        }
        if (prevLead.KYC.investment !== bodyInvestment) {
            changes.push(`Lead rate of investment was changed from ${prevLead.KYC.investment}$ to ${bodyInvestment}$`);
        }
        if (prevLead.KYC.time !== bodyTime) {
            changes.push(`Lead weekly time for trading was changed from ${prevLead.KYC.time} hours to ${bodyTime} hours`);
        }
        if (prevLead.KYC.riskTolerance !== bodyRiskTolerance) {
            changes.push(`Lead risk tolerance was changed from ${prevLead.KYC.riskTolerance} to ${bodyRiskTolerance}`);
        }
        if (prevLead.KYC.profitGoal !== bodyProfitGoal) {
            changes.push(`Lead profit goal was changed from ${prevLead.KYC.profitGoal} to ${bodyProfitGoal}`);
        }
        return changes;
    };


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
                case "Office1": {
                    prevLead = await Office1Leads.findOne({_id: leadId});
                    if (!prevLead){
                        return res.status(404).send({ message: 'Lead not found' });
                    }
                    const changesOffice1 = getChanges(prevLead, bodyTrading, bodyExpirience, bodyInvestment, bodyTime, bodyRiskTolerance, bodyProfitGoal);
                    if(changesOffice1.length > 0){
                        updatedLead = await Office1Leads.findOneAndUpdate({_id: leadId}, { 
                            KYC: {
                                trading: bodyTrading, expirience: bodyExpirience, investment: bodyInvestment, 
                                time: bodyTime, riskTolerance: bodyRiskTolerance, profitGoal: bodyProfitGoal,
                            },
                            latestComment: {
                                createdBy: {
                                    username: user.username,
                                    email: user.email,
                                    branch: authBranch,
                                    role: authRole,
                                },
                                createdAt: Date.now(),
                                comment: `${changesOffice1.join(', ')}. The following change(s) was(were) done by the user ${user.username}`
                            } 
                        }, { new: true });
                    } else {
                        return res.status(400).send({ message: "There are were no changes to current lead"});
                    };
                    await AllCommentsSchema.create({
                        ownerLeadId_office1: updatedLead._id,
                        createdBy: {
                            username: user.username,
                            email: user.email,
                            branch: authBranch,
                            role: authRole,
                        },
                        createdAt: Date.now(),
                        comment: `${changesOffice1.join(', ')}. The following change(s) was(were) done by the user ${user.username}`
                    });
                    break;
                };


                case "Office2":{
                    prevLead = await Office2Leads.findOne({_id: leadId});
                    if (!prevLead){
                        return res.status(404).send({ message: 'Lead not found' });
                    }
                    const changesOffice2 = getChanges(prevLead, bodyTrading, bodyExpirience, bodyInvestment, bodyTime, bodyRiskTolerance, bodyProfitGoal);
                    if(changesOffice2.length > 0){
                        updatedLead = await Office2Leads.findOneAndUpdate({_id: leadId}, { 
                            KYC: {
                                trading: bodyTrading, expirience: bodyExpirience, investment: bodyInvestment, 
                                time: bodyTime, riskTolerance: bodyRiskTolerance, profitGoal: bodyProfitGoal,
                            },
                            latestComment: {
                                createdBy: {
                                    username: user.username,
                                    email: user.email,
                                    branch: authBranch,
                                    role: authRole,
                                },
                                createdAt: Date.now(),
                                comment: `${changesOffice2.join(', ')}. The following change(s) was(were) done by the user ${user.username}`
                            } 
                        }, { new: true });
                    } else {
                        return res.status(400).send({ message: "There are were no changes to current lead"});
                    };
                    await AllCommentsSchema.create({
                        ownerLeadId_office2: updatedLead._id,
                        createdBy: {
                            username: user.username,
                            email: user.email,
                            branch: authBranch,
                            role: authRole,
                        },
                        createdAt: Date.now(),
                        comment: `${changesOffice2.join(', ')}. The following change(s) was(were) done by the user ${user.username}`
                    });
                    break;
                };
                default:
                    return res.status(400).send({ message: "Lead branch not specified in lead"});
            };
            break;
        case "Office1": {
            user = await Office1User.findOne({_id: authId});
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }
            prevLead = await Office1Leads.findOne({_id: leadId});
            if (!prevLead){
                return res.status(404).send({ message: 'Lead not found' });
            }
            const changesOffice1 = getChanges(prevLead, bodyTrading, bodyExpirience, bodyInvestment, bodyTime, bodyRiskTolerance, bodyProfitGoal);
            if(changesOffice1.length > 0){
                updatedLead = await Office1Leads.findOneAndUpdate({_id: leadId}, { 
                    KYC: {
                        trading: bodyTrading, expirience: bodyExpirience, investment: bodyInvestment, 
                        time: bodyTime, riskTolerance: bodyRiskTolerance, profitGoal: bodyProfitGoal,
                    },
                    latestComment: {
                        createdBy: {
                            username: user.username,
                            email: user.email,
                            branch: authBranch,
                            role: authRole,
                        },
                        createdAt: Date.now(),
                        comment: `${changesOffice1.join(', ')}. The following change(s) was(were) done by the user ${user.username}`
                    } 
                }, { new: true });
            } else {
                return res.status(400).send({ message: "There are were no changes to current lead"});
            };
            await AllCommentsSchema.create({
                ownerLeadId_office1: updatedLead._id,
                createdBy: {
                    username: user.username,
                    email: user.email,
                    branch: authBranch,
                    role: authRole,
                },
                createdAt: Date.now(),
                comment: `${changesOffice1.join(', ')}. The following change(s) was(were) done by the user ${user.username}`
            });
            break;
        };


        case "Office2":{
            user = await Office2User.findOne({_id: authId});
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }
            prevLead = await Office2Leads.findOne({_id: leadId});
            if (!prevLead){
                return res.status(404).send({ message: 'Lead not found' });
            }
            const changesOffice2 = getChanges(prevLead, bodyTrading, bodyExpirience, bodyInvestment, bodyTime, bodyRiskTolerance, bodyProfitGoal);
            if(changesOffice2.length > 0){
                updatedLead = await Office2Leads.findOneAndUpdate({_id: leadId}, { 
                    KYC: {
                        trading: bodyTrading, expirience: bodyExpirience, investment: bodyInvestment, 
                        time: bodyTime, riskTolerance: bodyRiskTolerance, profitGoal: bodyProfitGoal,
                    },
                    latestComment: {
                        createdBy: {
                            username: user.username,
                            email: user.email,
                            branch: authBranch,
                            role: authRole,
                        },
                        createdAt: Date.now(),
                        comment: `${changesOffice2.join(', ')}. The following change(s) was(were) done by the user ${user.username}`
                    } 
                }, { new: true });
            } else {
                return res.status(400).send({ message: "There are were no changes to current lead"});
            };
            await AllCommentsSchema.create({
                ownerLeadId_office2: updatedLead._id,
                createdBy: {
                    username: user.username,
                    email: user.email,
                    branch: authBranch,
                    role: authRole,
                },
                createdAt: Date.now(),
                comment: `${changesOffice2.join(', ')}. The following change(s) was(were) done by the user ${user.username}`
            });
            break;
        };
        default:
            return res.status(400).send({ message: 'Authorization branch is invalid' });
    };


    if (!updatedLead) {
        throw HttpError(404, "There are were no changes to current lead");
    };


    res.status(200).send(updatedLead);
};


module.exports = {
    updateLeadKYC: ctrlWrapper(updateLeadKYC),
};