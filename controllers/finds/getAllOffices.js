const { ctrlWrapper } = require("../../helpers");
const { Leads } = require("../../models/externalLead");



const getAllOffices = async (req, res) => {
    const { role: authRole, branch: authBranch } = req.auth;
    const { role: userRole, branch: userBranch } = req.user;
  
    if (authRole !== userRole || authBranch !== userBranch) {
      return res.status(403).send({ message: "Forbidden: Access denied" });
    }
  
    let leads;

    switch(authBranch){
        case "Main":
            leads = await Leads.find();
            if(!leads || leads.length === 0) {
                return res.status(404).send({message: `No filter option available`});
            } else {
                const leadOffices = leads.map(lead => lead.assignedOffice !== "" ? lead.assignedOffice : "Not Defined");
                const uniqueOffice = [...new Set(leadOffices)].sort((a, b) => {
                    if (a === "Not Defined") return -1;
                    if (b === "Not Defined") return 1;
                    return a.localeCompare(b);          
                });
                return res.status(200).send(uniqueOffice);
            }
        default:
            return res.status(404).send({message: `${authBranch} branch dosen't exist!`});
    }
};


module.exports = {
    getAllOffices: ctrlWrapper(getAllOffices),
};