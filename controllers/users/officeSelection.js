const {ctrlWrapper} = require("../../helpers/index");


const getOffice = async(req, res) => {
    const {role, branch} = req.user;
    const {role: authRole, branch: authBranch} = req.auth;

    
    let response;


    if (authRole !== role || authBranch !== branch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    if((authRole === "Developer" || 
        authRole === "Administrator" || 
        authRole === "Manager") && 
        authBranch === "Main"){
            response = [{office: 'Office1'}, {office: 'Office2'}];
    } else if((authRole === "CRM Manager" ||
        authRole === "Retention Manager" ||
        authRole === "Conversion Manager") && 
        authBranch === "Office1"){
        response = [{office1: 'Office1'}];
    } else if((authRole === "CRM Manager" ||
        authRole === "Retention Manager" ||
        authRole === "Conversion Manager") && 
        authBranch === "Office2"){
        response = [{office2: "Office2"}];
    } else {
        response = [];
    };


    res.send(response);

};


module.exports = {
    getOffice: ctrlWrapper(getOffice)
};