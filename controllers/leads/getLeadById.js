const {HttpError, ctrlWrapper} = require("../../helpers/index");
const { Leads } = require("../../models/ExternalLead");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");


const getLeadById = async (req, res) => {
  const {role: userRole, branch: userBranch} = req.user;
  const {role: authRole, branch: authBranch} = req.auth;
  const { leadId } = req.params;
  const { branch } = req.body;


  if (authRole !== userRole || authBranch !== userBranch) {
    return res.status(403).send({ message: 'Forbidden: Access denied' });
  };


  if (!leadId && !branch) {
    return res.status(400).send({ message: 'Lead ID and branch are required' });
  }


  let lead;


  switch(authBranch){
    case "Main":
      switch(branch){
        case "Office1":
          lead = await Office1Leads.findOne({_id: leadId});
          break;
        case "Office2":
          lead = await Office2Leads.findOne({_id: leadId});
          break;
        default:
          lead = await Leads.findOne({_id: leadId});
      };
      break;
    case "Office1":
      lead = await Office1Leads.findOne({_id: leadId});
      break;
    case "Office2":
      lead = await Office2Leads.findOne({_id: leadId});
      break;
    default:
      return res.status(400).send({ message: 'Authorization branch is invalid' });
  };


  if (!lead) {
    throw HttpError(404, "Lead was not found");
  };


  res.status(200).send(lead);
};


module.exports = {
  getLeadById: ctrlWrapper(getLeadById)
};