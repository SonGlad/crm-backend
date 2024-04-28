const {ctrlWrapper} = require("../../helpers/index");


const getOffice = async(req, res) => {
    const {role, branch} = req.user;
    const {role: authRole, branch: authBranch} = req.auth;

    
    let responce;


    if (authRole !== role || authBranch !== branch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    if((authRole === "Developer" || 
        authRole === "Administrator" || 
        authRole === "Manager") && 
        authBranch === "Main"){
            responce = [{office: 'Office1'}, {office: 'Office2'}];
    } else if((authRole === "CRM Manager" ||
        authRole === "Retention Manager" ||
        authRole === "Conversion Manager") && 
        authBranch === "Office1"){
        responce = [{office1: 'Office1'}];
    } else if((authRole === "CRM Manager" ||
        authRole === "Retention Manager" ||
        authRole === "Conversion Manager") && 
        authBranch === "Office2"){
        responce = [{office2: "Office2"}];
    } else {
        responce = [];
    };


    res.send(responce);

};


module.exports = {
    getOffice: ctrlWrapper(getOffice)
};