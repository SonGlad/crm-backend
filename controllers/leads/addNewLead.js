const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { Leads } = require("../../models/externalLead");
const { User } = require("../../models/MainUser");
const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");
const { AllCommentsSchema } = require("../../models/LeadsComments");
const { ctrlWrapper, HttpError } = require("../../helpers/index");


const addNewLead =  async (req, res) => {
    const { ...leadData } = req.body;
    const {role: userRole, branch: userBranch,} = req.user;
    const {role: authRole, branch: authBranch, id: authId} = req.auth;
    const { email, branch } = leadData;


    if (authRole !== userRole || authBranch !== userBranch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    const generateClientId = () => {
        const clientId = Math.floor(100000 + Math.random() * 900000);
        return clientId;
    };


    let existingLead;
    let newLead;
    let mainUser;
    let managerId;
    let clientId;
    let officeUser;
   

    switch(authBranch){
        case "Main":
            switch(branch){
                case "Office1":
                    existingLead = await Office1Leads.findOne({email});
                    break;
                case "Office2":
                    existingLead = await Office2Leads.findOne({email});
                    break;
                default:
                    existingLead = await Leads.findOne({email});  
            };
            break;
        case "Office1":
            existingLead = await Office1Leads.findOne({email});
            break;
        case "Office2":
            existingLead = await Office2Leads.findOne({email});
            break;
        default:
            return res.status(400).send({ message: 'Authorization branch is invalid' });
    };


    

    if (existingLead) {
        throw HttpError(400, "Such Lead already exists" );
    };


    
    switch(authBranch){
        case "Main":
            switch(branch){
                case "Office1":
                    mainUser = await User.findOne({_id: authId});
                    managerId = await Office1User.findOne({ role: "CRM Manager" });
                    clientId = generateClientId();
                    newLead = await Office1Leads.create({ ...leadData,
                        managerId: managerId._id, clientId, selfCreated: true,
                        owner: {
                            username: mainUser.username,
                            email: mainUser.email,
                            id: authId,
                            role: authRole, 
                        },
                        latestComment: {
                            createdBy: {
                                username: mainUser.username,
                                email: mainUser.email,
                                branch: authBranch,
                                role: authRole,
                            },
                            createdAt: Date.now(),
                            comment: `New Lead Was Created in Office 1 branch by user ${mainUser.username}`
                        }, 
                    });
                    await AllCommentsSchema.create({
                        ownerLeadId_office1: newLead._id,
                        createdBy: {
                            username: mainUser.username,
                            email: mainUser.email,
                            branch: authBranch,
                            role: authRole,
                        },
                        createdAt: Date.now(),
                        comment: `New Lead Was Created in Office 1 branch by user ${mainUser.username}`
                    });
                    break;


                case "Office2":
                    mainUser = await User.findOne({_id: authId});
                    managerId = await Office2User.findOne({ role: "CRM Manager" });
                    clientId = generateClientId();
                    newLead = await Office2Leads.create({ ...leadData,
                        managerId: managerId._id, clientId, selfCreated: true, 
                        owner: {
                            username: mainUser.username,
                            email: mainUser.email,
                            id: authId,
                            role: authRole, 
                        },
                        latestComment: {
                            createdBy: {
                                username: mainUser.username,
                                email: mainUser.email,
                                branch: authBranch,
                                role: authRole,
                            },
                            createdAt: Date.now(),
                            comment: `New Lead Was Created in Office 2 branch by ${mainUser.username}`
                        }, 
                    });
                    await AllCommentsSchema.create({
                        ownerLeadId_office2: newLead._id,
                        createdBy: {
                            username: mainUser.username,
                            email: mainUser.email,
                            branch: authBranch,
                            role: authRole,
                        },
                        createdAt: Date.now(),
                        comment: `New Lead Was Created in Office 2 branch by ${mainUser.username}`
                    });
                    break;
                default:
                    newLead = await Leads.create({ ...leadData});
            };
            break;
        case "Office1":
            officeUser = await Office1User.findOne({_id: authId});
            managerId = await Office1User.findOne({ role: "CRM Manager" });
            clientId = generateClientId();
            newLead = await Office1Leads.create({ ...leadData,
                managerId: managerId._id, clientId, selfCreated: true, assigned: true,
                owner: {
                    username: officeUser.username,
                    email: officeUser.email,
                    id: authId,
                    role: authRole, 
                },
                latestComment: {
                    createdBy: {
                        username: officeUser.username,
                        email: officeUser.email,
                        branch: authBranch,
                        role: authRole,
                    },
                    createdAt: Date.now(),
                    comment: `New Lead Was Created in Office 1 branch by user ${officeUser.username}`
                }, 
            });
            await AllCommentsSchema.create({
                ownerLeadId_office1: newLead._id,
                createdBy: {
                    username: officeUser.username,
                    email: officeUser.email,
                    branch: authBranch,
                    role: authRole,
                },
                createdAt: Date.now(),
                comment: `New Lead Was Created in Office 1 branch by user ${officeUser.username}`
            });
            break;


        case "Office2":
            officeUser = await Office2User.findOne({_id: authId});
            managerId = await Office2User.findOne({ role: "CRM Manager" });
            clientId = generateClientId();
            newLead = await Office2Leads.create({ ...leadData,
                managerId: managerId._id, clientId, selfCreated: true, assigned: true,
                owner: {
                    username: officeUser.username,
                    email: officeUser.email,
                    id: authId,
                    role: authRole, 
                },
                latestComment: {
                    createdBy: {
                        username: officeUser.username,
                        email: officeUser.email,
                        branch: authBranch,
                        role: authRole,
                    },
                    createdAt: Date.now(),
                    comment: `New Lead Was Created in Office 2 branch by user ${officeUser.username}`
                }, 
            });
            await AllCommentsSchema.create({
                ownerLeadId_office2: newLead._id,
                createdBy: {
                    username: officeUser.username,
                    email: officeUser.email,
                    branch: authBranch,
                    role: authRole,
                },
                createdAt: Date.now(),
                comment: `New Lead Was Created in Office 2 branch by user ${officeUser.username}`
            });
            break;
        default:
            return res.status(400).send({ message: 'Authorization role is invalid' });
    };


    res.status(201).send(newLead);
};


module.exports = {
    addNewLead: ctrlWrapper(addNewLead)
};


