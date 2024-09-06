const { ctrlWrapper } = require("../../helpers/index");
const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { User } = require("../../models/MainUser");
const { AllCommentsSchema } = require("../../models/LeadsComments");
const { Leads } = require("../../models/externalLead");


const leadReAssign = async (req, res) => {
  const { role: authRole, branch: authBranch, id: authId } = req.auth;
  const { leadId } = req.params;
  const {branch, conManagerId, conAgentId} = req.body;
  const { role: userRole, branch: userBranch } = req.user;


  if (authRole !== userRole || authBranch !== userBranch) {
    return res.status(403).send({ message: "Forbidden: Access denied" });
  }


  let lead;
  let officeUser;
  let mainUser;
  let conversionManagerId;
  let conversionAgentId;
  let assignedLead;
  let leadBeforeChanges;
  let prevUserId;
  let newAssignedLead;
  let newAssignedLeadData;
  let managerId;
  let existingLead;
  let externalLead;


  switch (authBranch) {
    case "Office1":
      lead = await Office1Leads.findById(leadId);
      officeUser = await Office1User.findById(authId);
      switch (authRole) {
        case "Conversion Manager":
          if(lead.selfCreated !== true){
            prevUserId = await Office1User.findById(lead.conAgentId);
            conversionAgentId = await Office1User.findById(conAgentId); 

            assignedLead = await Office1Leads.findByIdAndUpdate(leadId, {
              conAgentId: conversionAgentId._id,
              assigned: true,
              latestComment: {
                createdBy: {
                  username: officeUser.username,
                  email: officeUser.email,
                  branch: authBranch,
                  role: authRole,
                },
                createdAt: Date.now(),
                comment: prevUserId
                  ? `Current lead was reassigned from agent ${prevUserId.username} to ${officeUser.username}`
                  : "created",
              },
            })
            .populate({
              path: 'conAgentId',
              select:'username email'
            });

            await AllCommentsSchema.create({
              ownerLeadId_office1: leadId,
              createdBy: {
                username: officeUser.username,
                email: officeUser.email,
                branch: authBranch,
                role: authRole,
              },
              createdAt: Date.now(),
              comment: prevUserId.username
                ? `Current lead was reassigned from agent ${prevUserId.username} to ${officeUser.username}`
                : "This is first assign",
            });

            await Leads.findByIdAndUpdate(
              assignedLead.externalLeadId,
              {
                conAgent: {
                  name: conversionAgentId.username,
                  email: conversionAgentId.email,
                },
              },
              { new: true }
            );

            res.status(200).send(assignedLead);
          } else {
            return res.status(403).send({message: "You are not authorized to reassign self created lead"});
          }
        break;


        case "CRM Manager":
          if (lead.selfCreated !== true) {
            prevUserId = await Office1User.findById(lead.conManagerId);
            conversionManagerId = await Office1User.findById(conManagerId);
     
            assignedLead = await Office1Leads.findByIdAndUpdate(leadId, {
              conManagerId: conversionManagerId._id,
              latestComment: {
                createdBy: {
                  username: officeUser.username,
                  email: officeUser.email,
                  branch: authBranch,
                  role: authRole,
                },
                createdAt: Date.now(),
                comment: prevUserId
                  ? `Current lead was reassigned from manager ${prevUserId.username} to ${officeUser.username}`
                  : "created",
              },
            })
            .populate({
              path: 'conManagerId',
              select:'username email'
            })
            .populate({
              path: 'conAgentId',
              select:'username email'
            });

            await AllCommentsSchema.create({
              ownerLeadId_office1: leadId,
              createdBy: {
                username: officeUser.username,
                email: officeUser.email,
                branch: authBranch,
                role: authRole,
              },
              createdAt: Date.now(),
              comment: prevUserId.username
                ? `Current lead was reassigned from manager ${prevUserId.username} to ${officeUser.username}`
                : "This is first assign",
            });

            await Leads.findByIdAndUpdate(
              assignedLead.externalLeadId,
              {
                conManager: {
                  name: conversionManagerId.username,
                  email: conversionManagerId.email,
                },
              },
              { new: true }
            );

            res.status(200).send(assignedLead);
          } else {
            return res.status(403).send({message: "You are not authorized to reassign self created lead"});
          }
        break;
         
           
        default:
          res.status(404).send({message: "You don't have the right permissions in this branch"});
      }
    break;


    case "Office2":
      lead = await Office2Leads.findById(leadId);
      officeUser = await Office2User.findById(authId);
      switch (authRole) {
        case "Conversion Manager":
          if (lead.selfCreated !== true) {
            prevUserId = await Office2User.findById(lead.conAgentId);
            conversionAgentId = await Office2User.findById(conAgentId); 

            assignedLead = await Office2Leads.findByIdAndUpdate(leadId, {
              conAgentId: conversionAgentId._id,
              assigned: true,
              latestComment: {
                createdBy: {
                  username: officeUser.username,
                  email: officeUser.email,
                  branch: authBranch,
                  role: authRole,
                },
                createdAt: Date.now(),
                comment: prevUserId
                  ? `Current lead was reassigned from agent ${prevUserId.username} to ${officeUser.username}`
                  : "created",
              },
            })
            .populate({
              path: 'conAgentId',
              select:'username email'
            });

            await AllCommentsSchema.create({
              ownerLeadId_office1: leadId,
              createdBy: {
                username: officeUser.username,
                email: officeUser.email,
                branch: authBranch,
                role: authRole,
              },
              createdAt: Date.now(),
              comment: prevUserId.username
                ? `Current lead was reassigned from agent ${prevUserId.username} to ${officeUser.username}`
                : "This is first assign",
            });

            await Leads.findByIdAndUpdate(
              assignedLead.externalLeadId,
              {
                conAgent: {
                  name: conversionAgentId.username,
                  email: conversionAgentId.email,
                },
              },
              { new: true }
            );

            res.status(200).send(assignedLead);
          } else {
            return res.status(403).send({message: "You are not authorized to reassign self created lead"});
          }
        break;


        case "CRM Manager":
          if (lead.selfCreated !== true) {
            prevUserId = await Office2User.findById(lead.conManagerId);
            conversionManagerId = await Office2User.findById(conManagerId);

            assignedLead = await Office2Leads.findByIdAndUpdate(leadId, {
              conManagerId: conversionManagerId._id,
              assigned: false,
              latestComment: {
                createdBy: {
                  username: officeUser.username,
                  email: officeUser.email,
                  branch: authBranch,
                  role: authRole,
                },
                createdAt: Date.now(),
                comment: prevUserId
                  ? `Current lead was reassigned from manager ${prevUserId.username} to ${officeUser.username}`
                  : "created",
              },
            })
            .populate({
              path: 'conManagerId',
              select:'username email'
            })
            .populate({
              path: 'conAgentId',
              select:'username email'
            });

            await AllCommentsSchema.create({
              ownerLeadId_office1: leadId,
              createdBy: {
                username: officeUser.username,
                email: officeUser.email,
                branch: authBranch,
                role: authRole,
              },
              createdAt: Date.now(),
              comment: prevUserId.username
                ? `Current lead was reassigned from manager ${prevUserId.username} to ${officeUser.username}`
                : "This is first assign",
            });
            await Leads.findByIdAndUpdate(
              assignedLead.externalLeadId,
              {
                conManager: {
                  name: conversionManagerId.username,
                  email: conversionManagerId.email,
                },
              },
              { new: true }
            );

            res.status(200).send(assignedLead);
          } else {
            return res.status(403).send({message: "You are not authorized to reassign self created lead"});
          }
        break;


        default:
          res.status(404).send({message: "You don't have the right permissions in this branch"});
      }
    break;


    case "Main":
      mainUser = await User.findById({_id: authId});
      switch (branch) {
        case "Office2":
          leadBeforeChanges = await Office1Leads.findOne({externalLeadId: leadId});
          existingLead = await Office2Leads.findOne({email: leadBeforeChanges.email});
          if (existingLead) {
            res.status(404).send({message: `This lead exist in ${branch} branch!`});
            break;
          }

          await AllCommentsSchema.create({
            ownerLeadId_office1: leadBeforeChanges._id,
            createdBy: {
              username: mainUser.username,
              email: mainUser.email,
              branch: authBranch,
              role: authRole,
            },
            createdAt: Date.now(),
            comment: "Current lead was reassigned from branch Office1 to Office2",
          });

          managerId = await Office2User.findOne({ role: "CRM Manager" });
          newAssignedLeadData = {
            ...leadBeforeChanges.toObject(),
            managerId: managerId._id,
            conManagerId: null,
            conAgentId: null,
            branch: branch,
            assigned: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            latestComment: {
              createdBy: {
                username: mainUser.username,
                email: mainUser.email,
                branch: authBranch,
                role: authRole,
              },
              createdAt: Date.now(),
              comment: "Current lead was reassigned from branch Office1 to Office2",
            },
          };
          delete newAssignedLeadData._id;
          newAssignedLead = await Office2Leads.create(newAssignedLeadData);

          await AllCommentsSchema.updateMany(
            { ownerLeadId_office1: leadBeforeChanges._id },
            { 
              $set: { ownerLeadId_office2: newAssignedLead._id },
              $unset: { ownerLeadId_office1: "" }
            }
          );

          externalLead = await Leads.findByIdAndUpdate(leadId, {
            assignedOffice: branch,
            crmManager: {
              name: managerId.username,
              email: managerId.email,
            },
            conManager: {
              name: '',
              email: '',
            },
            conAgent: {
              name: '',
              email: ''
            }
          },{ new: true });

          await Office1Leads.findByIdAndDelete(leadBeforeChanges._id)

          res.status(200).send(externalLead);
        break;


        case "Office1":
          leadBeforeChanges = await Office2Leads.findOne({externalLeadId: leadId});
          existingLead = await Office1Leads.findOne({email: leadBeforeChanges.email});
          if (existingLead) {
            res.status(404).send({message: `This lead exist in ${branch} branch!`});
            break;
          }

          await AllCommentsSchema.create({
            ownerLeadId_office2: leadBeforeChanges._id,
            createdBy: {
              username: mainUser.username,
              email: mainUser.email,
              branch: authBranch,
              role: authRole,
            },
            createdAt: Date.now(),
            comment: "Current lead was reassigned from branch Office2 to Office1",
          });

          managerId = await Office1User.findOne({ role: "CRM Manager" });
          newAssignedLeadData = {
            ...leadBeforeChanges.toObject(),
            managerId: managerId._id,
            conManagerId: null,
            conAgentId: null,
            branch: branch,
            assigned: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            latestComment: {
              createdBy: {
                username: mainUser.username,
                email: mainUser.email,
                branch: authBranch,
                role: authRole,
              },
              createdAt: Date.now(),
              comment: "Current lead was reassigned from branch Office2 to Office1",
            },
          };
          delete newAssignedLeadData._id;
          newAssignedLead = await Office1Leads.create(newAssignedLeadData);

          await AllCommentsSchema.updateMany(
            { ownerLeadId_office2: leadBeforeChanges._id },
            { 
              $set: { ownerLeadId_office1: newAssignedLead._id },
              $unset: { ownerLeadId_office2: "" }
            }
          );

          externalLead = await Leads.findByIdAndUpdate(leadId, {
            assignedOffice: branch,
            crmManager: {
              name: managerId.username,
              email: managerId.email,
            },
            conManager: {
              name: '',
              email: '',
            },
            conAgent: {
              name: '',
              email: ''
            }
          },{ new: true });

          await Office2Leads.findByIdAndDelete(leadBeforeChanges._id)

          res.status(200).send(externalLead);
        break;


        default:
          res.status(404).send({
            message: `${branch} branch dosen't exist!`,
          });
      }
    break;

    default:
      res.status(400).send({
        message: "Your branch dont have permissions to reassing this lead",
      });
  }
};

module.exports = {
  leadReAssign: ctrlWrapper(leadReAssign),
};
