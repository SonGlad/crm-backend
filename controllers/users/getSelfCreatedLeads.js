const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");

const { ctrlWrapper, HttpError } = require("../../helpers/index");


const getSelfCreatedLeads = async (req, res) => {
    const { userId } = req.params;
    const { branch: reqBranch } = req.query;
    const {role, branch} = req.user;
    const {role: authRole, branch: authBranch} = req.auth;


    if (authRole !== role || authBranch !== branch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    let response;
    let user;


    switch(authBranch){
        case "Main":
            switch(reqBranch){
                case "Office1":
                    response = await Office1Leads.find({'owner.id': userId});
                    break;
                case "Office2":
                    response = await Office2Leads.find({'owner.id': userId});
                    break;
                default:
                    return res.status(400).send({ message: 'Invalid branch specified' });
            };
            break;
        case "Office1":
            switch(authRole){
                case "CRM Manager":
                    user = await Office1User.findOne({_id: userId});
                    if(user.role === "CRM Manager"){
                        throw HttpError(403, "You are not allowed to check self created leads for such user(s)");
                    } else {
                        response = await Office1Leads.find({'owner.id': userId});
                    };
                    break;
                case "Conversion Manager":
                    user = await Office1User.findOne({_id: userId});
                    if(user.role === "CRM Manager" || user.role === "Conversion Manager"){
                        throw HttpError(403, "You are not allowed to check self created leads for such user(s)");
                    } else {
                        response = await Office1Leads.find({'owner.id': userId});
                    };
                    break;
                case "Conversion Agent":
                    return res.status(400).send({ message: 'You are not authorized to check Self Created leads fo other users' });
                default:
                    return res.status(400).send({ message: 'You are not authorized to check Self Created leads fo other users' });
            };
            break;
        case "Office2":
            switch(authRole){
                case "CRM Manager":
                    user = await Office2User.findOne({_id: userId});
                    if(user.role === "CRM Manager"){
                        throw HttpError(403, "You are not allowed to check self created leads for such user(s)");
                    } else {
                        response = await Office2Leads.find({'owner.id': userId});
                    };
                    break;
                case "Conversion Manager":
                    user = await Office2User.findOne({_id: userId});
                    if(user.role === "CRM Manager" || user.role === "Conversion Manager"){
                        throw HttpError(403, "You are not allowed to check self created leads for such user(s)");
                    } else {
                        response = await Office2Leads.find({'owner.id': userId});
                    };
                    break;
                case "Conversion Agent":
                    return res.status(400).send({ message: 'You are not authorized to check Self Created leads fo other users' });
                default:
                    return res.status(400).send({ message: 'You are not authorized to check Self Created leads fo other users' });
            };
            break;
        default:
            return res.status(400).send({ message: 'Authorization branch is invalid' });
    };


    if(!response || response.length === 0) {
        throw HttpError(404, "No personal or self-created leads were found");
    };


    res.status(200).send(response);
};


module.exports ={
    getSelfCreatedLeads: ctrlWrapper(getSelfCreatedLeads)
};