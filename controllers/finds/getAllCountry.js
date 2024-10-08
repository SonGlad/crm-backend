const { ctrlWrapper } = require("../../helpers");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");

const getAllCountry = async (req, res) => {
  const { role: authRole, branch: authBranch, id: authId } = req.auth;
  const { branch } = req.query;
  const { role: userRole, branch: userBranch } = req.user;

  if (authRole !== userRole || authBranch !== userBranch) {
    return res.status(403).send({ message: "Forbidden: Access denied" });
  }

  let leads; 

  const countryResponse = (leads, res) => {
    if(!leads || leads.length === 0){
      return res.status(404).send({message: `No filter option available`});
    } else {
      const leadCountry = leads.map(lead => lead.country !== "" ? lead.country : "Not Defined");
      const uniqueCountry = [...new Set(leadCountry)].sort((a, b) => {
        if (a === "Not Defined") return -1;
        if (b === "Not Defined") return 1;
        return a.localeCompare(b);          
      });
      return res.status(200).send(uniqueCountry);
    }
  };
  

  switch (authBranch) {
    case "Main":
      switch (branch) {
        case "Office1":
          leads = await Office1Leads.find();
          countryResponse(leads, res);
        break;

        case "Office2":
          leads = await Office2Leads.find();
          countryResponse(leads, res);
        break;

        default:
          return res.status(403).send({message: `Invalid branch!`});
      }
    break;

    case "Office1":
      switch (authRole) {
        case "CRM Manager":
          leads = await Office1Leads.find({
            $or: [{managerId: authId}, {'owner.id': authId }]
          });
          countryResponse(leads, res);
        break;

        case "Conversion Manager":
          leads = await Office1Leads.find({
            $or: [{conManagerId: authId}, {'owner.id': authId }]
          });
          countryResponse(leads, res);
        break;

        case "Conversion Agent":
          leads = await Office1Leads.find({
            $or: [{conAgentId: authId}, {'owner.id': authId }]
          });
          countryResponse(leads, res);
        break;

        default:
          return res.status(403).send({message: `Invalid role of user!`});
      }
    break;

    case "Office2":
      switch (authRole) {
        case "CRM Manager":
          leads = await Office2Leads.find({
            $or: [{managerId: authId}, {'owner.id': authId }]
          });
          countryResponse(leads, res);
        break;

        case "Conversion Manager":
          leads = await Office2Leads.find({
            $or: [{conManagerId: authId}, {'owner.id': authId }]
          });
          countryResponse(leads, res);
        break;

        case "Conversion Agent":
          leads = await Office2Leads.find({
            $or: [{conAgentId: authId}, {'owner.id': authId }]
          });
          countryResponse(leads, res);
        break;

        default:
          return res.status(403).send({message: `Invalid role of user!`});
      }
    break;
    default:
      return res.status(404).send({message: `${authBranch} branch dosen't exist!`});
  }
};

module.exports = {
  getAllCountry: ctrlWrapper(getAllCountry),
};
