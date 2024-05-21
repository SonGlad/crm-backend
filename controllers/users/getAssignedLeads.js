const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { ctrlWrapper, HttpError } = require("../../helpers/index");


const getAssignedLeads = async (req, res) => {
    const { userId } = req.params;
    const { branch: reqBranch } = req.body;
    const {role, branch} = req.user;
    const {role: authRole, branch: authBranch} = req.auth;


    if (authRole !== role || authBranch !== branch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    let response;


    switch(authBranch){
        case "Main":
            switch(reqBranch){
                case "Office1":
                    response = await Office1Leads.find({    
                        $or: [
                        { managerId: userId },
                        { conManagerId: userId },
                        { conAgentId: userId }
                    ]});
                    break;
                case "Office2":
                    response = await Office2Leads.find({    
                        $or: [
                        { managerId: userId },
                        { conManagerId: userId },
                        { conAgentId: userId }
                    ]});
                    break;
                default:
                    return res.status(400).send({ message: 'Invalid branch specified' });
            };
            break;
        case "Office1":
            switch (authRole){
                case "CRM Manager":
                    response = await Office1Leads.find({     
                        $or: [
                            { conManagerId: userId },
                            { conAgentId: userId }
                        ]
                    });
                    break;
                case "Conversion Manager":
                    response = await Office1Leads.find({     
                        $or: [
                            { conAgentId: userId }
                        ]
                    });
                    break;
                case "Conversion Agent":
                    throw HttpError(403, "You are not authorized to check the the current user leads");
                default: 
                    throw HttpError(403, "You are not authorized to check the the current user leads"); 
            };
            break;
        case "Office2":
            switch (authRole){
                case "CRM Manager":
                    response = await Office2Leads.find({     
                        $or: [
                            { conManagerId: userId },
                            { conAgentId: userId }
                        ]
                    });
                    break;
                case "Conversion Manager":
                    response = await Office2Leads.find({     
                        $or: [
                            { conAgentId: userId }
                        ]
                    });
                    break;
                case "Conversion Agent":
                    throw HttpError(403, "You are not authorized to check the the current user leads");
                default: 
                    throw HttpError(403, "You are not authorized to check the the current user leads"); 
            };
            break;
        default:
            return res.status(400).send({ message: 'Authorization branch is invalid' });
    };


    if(!response || response.length === 0) {
        throw HttpError(404, "No assigned leads were found");
    };


    res.status(200).send(response);
};


module.exports ={
    getAssignedLeads: ctrlWrapper(getAssignedLeads)
};