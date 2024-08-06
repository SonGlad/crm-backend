const { User } = require("../../models/MainUser");
const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");
const { Leads } = require("../../models/externalLead");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { AllCommentsSchema } = require("../../models/LeadsComments");
const { ctrlWrapper, HttpError } = require("../../helpers/index");


const leadAssign = async (req, res) => {
  const {name, lastName, email, phone, resource, branch, conManagerId, conAgentId} = req.body;
  const { leadId } = req.params;
  const { role: userRole, branch: userBranch } = req.user;
  const { role: authRole, branch: authBranch, id: authId } = req.auth;


  if (authRole !== userRole || authBranch !== userBranch) {
    return res.status(403).send({ message: "Forbidden: Access denied" });
  };


  const generateClientId = () => {
    const clientId = Math.floor(100000 + Math.random() * 900000);
    return clientId;
  };


  let mainUser;
  let officeUser;
  let clientId;
  let existingLead;
  let lead;
  let newLead;
  let managerId;
  let conversionManagerId;
  let conversionAgentId;
  let assignedLead;
  let externalLead;


  switch (authBranch) {
    case "Main":
      switch (branch) {
        case "Office1":
          existingLead = await Office1Leads.findOne({ email });
          break;
        case "Office2":
          existingLead = await Office2Leads.findOne({ email });
          break;
        default:
          return res.status(400).send({ message: "Invalid branch specified" });
      }
      break;
    case "Office1":
      existingLead = await Office1Leads.findOne({ email });
      break;
    case "Office2":
      existingLead = await Office2Leads.findOne({ email });
      break;
    default:
      return res.status(400).send({ message: "Authorization branch is invalid" });
  };


  if (existingLead) {
    throw HttpError(400, "Such Lead already exists");
  };


  switch (authBranch) {
    case "Main":
      switch (branch) {
        case "Office1":
          mainUser = await User.findOne({ _id: authId });
          managerId = await Office1User.findOne({ role: "CRM Manager" });
          clientId = generateClientId();
          newLead = await Office1Leads.create({
            name, lastName, email, phone, resource, branch, 
            externalLeadId: leadId, managerId: managerId._id, clientId,
            latestComment: {
              createdBy: {
                username: mainUser.username,
                email: mainUser.email,
                branch: authBranch,
                role: authRole,
              },
              createdAt: Date.now(),
              comment: `Lead created & Assigned to Office 1 CRM Manager: ${managerId.username}`,
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
            comment: `Lead created & Assigned to Office 1 CRM Manager: ${managerId.username}`,
          });
          externalLead = await Leads.findByIdAndUpdate(leadId, {
            newContact: false,
            assigned: true,
            assignedOffice: branch,
            crmManager: {
              name: managerId.username,
              email: managerId.email,
            },
          }, { new: true });
        break;


        case "Office2":
          mainUser = await User.findOne({ _id: authId });
          managerId = await Office2User.findOne({ role: "CRM Manager" });
          clientId = generateClientId();
          newLead = await Office2Leads.create({
            name, lastName, email, phone, resource, branch, 
            externalLeadId: leadId, managerId: managerId._id, clientId,
            latestComment: {
              createdBy: {
                username: mainUser.username,
                email: mainUser.email,
                branch: authBranch,
              },
              createdAt: Date.now(),
              comment: `Lead created & Assigned to Office 2 CRM Manager: ${managerId.username}`,
            },
          });
          await AllCommentsSchema.create({
            ownerLeadId_office2: newLead._id,
            createdBy: {
              username: mainUser.username,
              email: mainUser.email,
              branch: authBranch,
            },
            createdAt: Date.now(),
            comment: `Lead created & Assigned to Office 2 CRM Manager: ${managerId.username}`,
          });
          externalLead = await Leads.findByIdAndUpdate(leadId, {
            newContact: false, assigned: true, assignedOffice: branch,
            crmManager: {
              name: managerId.username,
              email: managerId.email,
            },
          },{ new: true });
          break;
        default:
          return res.status(400).send({ message: "Invalid branch specified" });
      }
    break;


    case "Office1":
      switch (authRole) {
        case "CRM Manager":
          officeUser = await Office1User.findById({ _id: authId });
          conversionManagerId = await Office1User.findById({_id: conManagerId});
          lead = await Office1Leads.findById({_id: leadId});
          if (lead.selfCreated !== true) {
            assignedLead = await Office1Leads.findByIdAndUpdate(leadId, {
              conManagerId: conversionManagerId,
              latestComment: {
                createdBy: {
                  username: officeUser.username,
                  email: officeUser.email,
                  branch: authBranch,
                  role: authRole,
                },
                createdAt: Date.now(),
                comment: `Lead Assigned to Office 1 Conversion Manager: ${conversionManagerId.username}`,
              },
            }, { new: true });
            await AllCommentsSchema.create({
              ownerLeadId_office1: leadId,
              createdBy: {
                username: officeUser.username,
                email: officeUser.email,
                branch: authBranch,
                role: authRole,
              },
              createdAt: Date.now(),
              comment: `Lead Assigned to Office 1 Conversion Manager: ${conversionManagerId.username}`,
            });
            await Leads.findByIdAndUpdate(assignedLead.externalLeadId, {
              conManager: {
                name: conversionManagerId.username,
                email: conversionManagerId.email,
              },
            }, { new: true });
          } else {
            return res.status(403).send({ message: "You are not allowed for this type of action" });
          }
          break;


        case "Conversion Manager":
          officeUser = await Office1User.findById({_id: authId});
          conversionAgentId = await Office1User.findById({_id: conAgentId});
          assignedLead = await Office1Leads.findByIdAndUpdate(leadId, {
            conAgentId: conversionAgentId, assigned: true,
            latestComment: {
              createdBy: {
                username: officeUser.username,
                email: officeUser.email,
                branch: authBranch,
                role: authRole,
              },
              createdAt: Date.now(),
              comment: `Lead Assigned to Office 1 Conversion Agent: ${conversionAgentId.username}`
            } 
          }, {new: true});
          await AllCommentsSchema.create({
            ownerLeadId_office1: leadId,
            createdBy: {
              username: officeUser.username,
              email: officeUser.email,
              branch: authBranch,
              role: authRole,
            },
            createdAt: Date.now(),
            comment: `Lead Assigned to Office 1 Conversion Agent: ${conversionAgentId.username}`
          });
          await Leads.findByIdAndUpdate(assignedLead.externalLeadId, {
            conAgent: {
              name: conversionAgentId.username,
              email: conversionAgentId.email
            }
          }, { new: true });
          break;
        default:
          return res.status(400).send({ message: 'Invalid authorization role specified' });
      };
    break;


    case "Office2":
      switch (authRole) {
        case "CRM Manager":
          officeUser = await Office2User.findById({ _id: authId });
          conversionManagerId = await Office2User.findById({_id: conManagerId});
          lead = await Office2Leads.findById({_id: leadId});
          if (lead.selfCreated !== true) {
            assignedLead = await Office2Leads.findByIdAndUpdate(leadId, {
              conManagerId: conversionManagerId,
              latestComment: {
                createdBy: {
                  username: officeUser.username,
                  email: officeUser.email,
                  branch: authBranch,
                  role: authRole,
                },
                createdAt: Date.now(),
                comment: `Lead Assigned to Office 2 Conversion Manager: ${conversionManagerId.username}`,
              },
            },{ new: true });
            await AllCommentsSchema.create({
              ownerLeadId_office2: leadId,
              createdBy: {
                username: officeUser.username,
                email: officeUser.email,
                branch: authBranch,
                role: authRole,
              },
              createdAt: Date.now(),
              comment: `Lead Assigned to Office 2 Conversion Manager: ${conversionManagerId.username}`,
            });
            await Leads.findByIdAndUpdate(assignedLead.externalLeadId, {
              conManager: {
                name: conversionManagerId.username,
                email: conversionManagerId.email,
              },
            },{ new: true });
          } else {
            return res.status(403).send({ message: "You are not allowed for this type of action" });
          }
          break;


        case "Conversion Manager":
          officeUser = await Office2User.findById({ _id: authId });
          conversionAgentId = await Office2User.findById({ _id: conAgentId });
          assignedLead = await Office2Leads.findByIdAndUpdate(leadId, {
            conAgentId: conversionAgentId,
            latestComment: {
              createdBy: {
                username: officeUser.username,
                email: officeUser.email,
                branch: authBranch,
                role: authRole,
              },
              createdAt: Date.now(),
              comment: `Lead Assigned to Office 2 Conversion Agent: ${conversionAgentId.username}`,
            },
          }, {new: true});
          await AllCommentsSchema.create({
            ownerLeadId_office2: leadId,
            createdBy: {
              username: officeUser.username,
              email: officeUser.email,
              branch: authBranch,
              role: authRole,
            },
            createdAt: Date.now(),
            comment: `Lead Assigned to Office 2 Conversion Agent: ${conversionAgentId.username}`,
          });
          await Leads.findByIdAndUpdate(assignedLead.externalLeadId, {
            conAgent: {
              name: conversionAgentId.username,
              email: conversionAgentId.email,
            },
          }, { new: true });
          break;
        default:
          return res.status(400).send({ message: "Invalid authorization role specified" });
      };
      break;
    default:
      return res.status(400).send({ message: "Invalid authorization branch specified" });
  };


  switch (authBranch) {
    case "Main":
      res.status(200).send(externalLead);
      break;
    default:
      res.status(201).send(assignedLead);
  };
};


module.exports = {
  leadAssign: ctrlWrapper(leadAssign),
};
