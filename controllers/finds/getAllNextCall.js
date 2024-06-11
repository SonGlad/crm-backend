const { ctrlWrapper } = require("../../helpers");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");

const getAllNextCall = async (req, res) => {
  const { role: authRole, branch: authBranch, id: authId } = req.auth;
  const { branch } = req.body;
  const { role: userRole, branch: userBranch } = req.user;

  if (authRole !== userRole || authBranch !== userBranch) {
    return res.status(403).send({ message: "Forbidden: Access denied" });
  }

  let leads;
  let leadNextCall;
  let uniqueNextCall;
  

  switch (authBranch) {
    case "Main":
      switch (branch) {
          case "Office1":
              if (await Office1Leads.find({ nextCall: { $exists: true, $ne: null } })){
               leads = await Office1Leads.find({ nextCall: { $exists: true, $ne: null } });
              leadNextCall = leads.map(lead => lead.nextCall).filter(nextCall => nextCall !== "");
          uniqueNextCall = [...new Set(leadNextCall)];
                  res.status(200).send(uniqueNextCall);
              }
          break;
        case "Office2":
              if (await Office2Leads.find({ nextCall: { $exists: true, $ne: null } })){
              leads = await Office2Leads.find({ nextCall: { $exists: true, $ne: null } });
              leadNextCall = leads.map(lead => lead.nextCall).filter(nextCall => nextCall !== "");
          uniqueNextCall = [...new Set(leadNextCall)];
                  res.status(200).send(uniqueNextCall);
              }
          break;
        default:
          res.status(403).send({
            message: `Invalid branch!`,
          });
      }
      break;
    case "Office1":
      switch (authRole) {
        case "CRM Manager":
              if (await Office1Leads.find({ nextCall: { $exists: true, $ne: null } })){
               leads = await Office1Leads.find({ nextCall: { $exists: true, $ne: null } });
              leadNextCall = leads.map(lead => lead.nextCall).filter(nextCall => nextCall !== "");
          uniqueNextCall = [...new Set(leadNextCall)];
                  res.status(200).send(uniqueNextCall);
              }
          break;
        case "Conversion Manager":
              if (await Office1Leads.find({ nextCall: { $exists: true, $ne: null }, conManagerId: authId })){
               leads = await Office1Leads.find({ nextCall: { $exists: true, $ne: null }, conManagerId: authId });
              leadNextCall = leads.map(lead => lead.nextCall).filter(nextCall => nextCall !== "");
          uniqueNextCall = [...new Set(leadNextCall)];
                  res.status(200).send(uniqueNextCall);
              }
          break;
        case "Conversion Agent":
              if (await Office1Leads.find({ nextCall: { $exists: true, $ne: null }, conAgentId: authId })){
               leads = await Office1Leads.find({ nextCall: { $exists: true, $ne: null }, conAgentId: authId });
              leadNextCall = leads.map(lead => lead.nextCall).filter(nextCall => nextCall !== "");
          uniqueNextCall = [...new Set(leadNextCall)];
                  res.status(200).send(uniqueNextCall);
              }
          break;
        default:
          res.status(403).send({
            message: `Invalid role of user!`,
          });
      }
      break;
    case "Office2":
      switch (authRole) {
        case "CRM Manager":
              if (await Office2Leads.find({ nextCall: { $exists: true, $ne: null } })){
               leads = await Office2Leads.find({ nextCall: { $exists: true, $ne: null } });
              leadNextCall = leads.map(lead => lead.nextCall).filter(nextCall => nextCall !== "");
          uniqueNextCall = [...new Set(leadNextCall)];
                  res.status(200).send(uniqueNextCall);
              }
          break;
        case "Conversion Manager":
              if (await Office2Leads.find({ nextCall: { $exists: true, $ne: null }, conManagerId: authId })){
               leads = await Office2Leads.find({ nextCall: { $exists: true, $ne: null }, conManagerId: authId });
              leadNextCall = leads.map(lead => lead.nextCall).filter(nextCall => nextCall !== "");
          uniqueNextCall = [...new Set(leadNextCall)];
                  res.status(200).send(uniqueNextCall);
              }
          break;
        case "Conversion Agent":
              if (await Office2Leads.find({ nextCall: { $exists: true, $ne: null }, conAgentId: authId })){
               leads = await Office2Leads.find({ nextCall: { $exists: true, $ne: null }, conAgentId: authId });
              leadNextCall = leads.map(lead => lead.nextCall).filter(nextCall => nextCall !== "");
          uniqueNextCall = [...new Set(leadNextCall)];
                  res.status(200).send(uniqueNextCall);
              }
          break;
        default:
          res.status(403).send({
            message: `Invalid role of user!`,
          });
      }
      break;
    default:
      res.status(404).send({
        message: `${authBranch} branch dosen't exist!`,
      });
  }
};

module.exports = {
  getAllNextCall: ctrlWrapper(getAllNextCall),
};
