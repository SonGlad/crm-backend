const {ctrlWrapper} = require("../../helpers/index");
const { Leads } = require("../../models/ExternalLead");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { AllCommentsSchema } = require("../../models/LeadsComments");


const deleteLeadById = async (req, res) => {
  const { leadId } = req.params;
  const {role: userRole, branch: userBranch,} = req.user;
  const {role: authRole, branch: authBranch, id: authId} = req.auth;


  if (authRole !== userRole || authBranch !== userBranch) {
    return res.status(403).send({ message: 'Forbidden: Access denied' });
  };
  

  let result;
  let lead; 
  let branchLead;
  let branch;
  let leadComments;
  let deletedComments;
  let deletedOfficeLeads;
  let messages;
  


  switch(authBranch){
    case "Main":
      branchLead = await Leads.findById(leadId)
      if(branchLead){
        branch = "External";
      } else {
        branchLead = await Office1Leads.findById(leadId);
        if (branchLead) {
          branch = "Office1";
        } else {
          branchLead = await Office2Leads.findById(leadId);
          if (lead) {
            branch = 'Office2';
          }
        }
      };
      if(!branchLead){
        return res.status(404).send({ message: 'Lead was not found' });
      };


      switch(branch){
        case "External":
          if(branchLead.assignedOffice === "Not Assigned"){
            result = await Leads.findByIdAndDelete(leadId);
          } else {
            switch(branchLead.assignedOffice){
              case "Office1":
                lead = await Office1Leads.findOne({externalLeadId: leadId})
                leadComments = await AllCommentsSchema.find({ownerLeadId_office1: lead._id});
                if(!leadComments || leadComments.length === 0){
                  return res.status(404).send({ message: 'No comments were found for the Lead in Office1 branch'});
                };
                deletedComments = await AllCommentsSchema.deleteMany({ownerLeadId_office1: lead._id});
                deletedOfficeLeads = await Office1Leads.findOneAndDelete({externalLeadId: leadId});
                result = await Leads.findOneAndDelete(leadId); 
                break;


              case "Office2":
                lead = await Office2Leads.findOne({externalLeadId: leadId})
                leadComments = await AllCommentsSchema.find({ownerLeadId_office2: lead._id});
                if(!leadComments || leadComments.length === 0){
                  return res.status(404).send({ message: 'No comments were found for the Lead in Office1 branch'});
                };
                deletedComments = await AllCommentsSchema.deleteMany({ownerLeadId_office2: lead._id});
                deletedOfficeLeads = await Office2Leads.findOneAndDelete({externalLeadId: leadId});
                result = await Leads.findOneAndDelete(leadId); 
                break;
              default:
                return res.status(400).send({ message: 'Branch in Office 1 or Office 2 was not defined' });
            };
          };
          break;


        case "Office1":
          leadComments = await AllCommentsSchema.find({ownerLeadId_office1: branchLead._id});
          if(!leadComments || leadComments.length === 0){
            return res.status(404).send({ message: 'No comments were found for the Lead in Office 1 branch'});
          };
          if(branchLead.selfCreated === true){
            deletedComments = await AllCommentsSchema.deleteMany({ownerLeadId_office1: branchLead._id});
            deletedOfficeLeads = await Office1Leads.findByIdAndDelete(leadId);
          } else {
            lead = await Leads.findOneAndUpdate({_id: branchLead.externalLeadId}, {
              assignedOffice: "Not Assigned", crmManager :{name: "", email: ""},
              conManager: {name: "", email: ""}, conAgent: {name: "", email: ""} 
            });
            deletedComments = await AllCommentsSchema.deleteMany({ownerLeadId_office1: branchLead._id});
            deletedOfficeLeads = await Office1Leads.findByIdAndDelete(leadId);
          }
          break;


        case "Office2":
          leadComments = await AllCommentsSchema.find({ownerLeadId_office2: branchLead._id});
          if(!leadComments || leadComments.length === 0){
            return res.status(404).send({ message: 'No comments were found for the Lead in Office 2 branch'});
          };
          if(branchLead.selfCreated === true){
            deletedComments = await AllCommentsSchema.deleteMany({ownerLeadId_office2: branchLead._id});
            deletedOfficeLeads = await Office2Leads.findByIdAndDelete(leadId);
          } else {
            lead = await Leads.findOneAndUpdate({_id: branchLead.externalLeadId}, {
              assignedOffice: "Not Assigned", crmManager :{name: "", email: ""},
              conManager: {name: "", email: ""}, conAgent: {name: "", email: ""} 
            });
            deletedComments = await AllCommentsSchema.deleteMany({ownerLeadId_office2: branchLead._id});
            deletedOfficeLeads = await Office2Leads.findByIdAndDelete(leadId);
          }
          break;
        default:
          return res.status(400).send({ message: 'Branch was not defined' });
      };
      break;


    case "Office1":
      branchLead = await Office1Leads.findById(leadId);
      if (!branchLead) {
        return res.status(404).send({ message: 'Lead was not found' });
      }
      if(branchLead.selfCreated === true && branchLead.owner.id.toString() === authId){
        deletedComments = await AllCommentsSchema.deleteMany({ownerLeadId_office1: branchLead._id});
        deletedOfficeLeads = await Office1Leads.findByIdAndDelete(leadId);
      } else {
        return res.status(403).send({ message: 'You have no rights to delete the lead if you are not owner of it' }); 
      }
      break;


    case "Office2":
      branchLead = await Office2Leads.findById(leadId);
      if (!branchLead) {
        return res.status(404).send({ message: 'Lead was not found' });
      }
      if(branchLead.selfCreated === true && branchLead.owner.id.toString() === authId){
        deletedComments = await AllCommentsSchema.deleteMany({ownerLeadId_office2: branchLead._id});
        deletedOfficeLeads = await Office2Leads.findByIdAndDelete(leadId);
      } else {
        return res.status(403).send({ message: 'You have no rights to delete the lead if you are not owner of it' }); 
      }
      break;
    default:
      return res.status(400).send({ message: 'Authorization branch is invalid' }); 
  };



    switch(authBranch) {
    case "Main":
      if (branchLead.assignedOffice === "Not Assigned") {
        return res.status(200).send({ _id: result._id, message: "Lead Deleted" });
      }
  
      messages = [
        `All ${deletedComments.deletedCount} comments associated with lead ${branchLead._id} were deleted`,
        `Deleted ${deletedOfficeLeads._id} lead associated with lead ${leadId}`
      ];
  
      if (branch !== "Office1" && branch !== "Office2") {
        messages.unshift(`Deleted ${result._id} lead`);
      }
  
      return res.status(200).send({
        deletedCommentsCount: deletedComments.deletedCount,
        deletedOfficeLeadId: deletedOfficeLeads._id,
        messages
      });
  
    case "Office1":
    default:
      return res.status(200).send({
        deletedCommentsCount: deletedComments.deletedCount,
        deletedOfficeLeadId: deletedOfficeLeads._id,
        messages: [
          `All ${deletedComments.deletedCount} comments associated with lead ${branchLead._id} were deleted`,
          `Deleted ${deletedOfficeLeads._id} lead associated with lead ${leadId}`
        ]
      });
  };
};


module.exports = {
  deleteLeadById: ctrlWrapper(deleteLeadById)
};

