const {ctrlWrapper} = require("../../helpers/index");


const getRole = async(req, res) => {
    const {role, branch} = req.user;
    const {role: authRole, branch: authBranch} = req.auth;

    
    let responce;


    if (authRole !== role || authBranch !== branch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    switch(authRole) {
        case('Developer'):
            responce = [{role: 'CRM Manager'}, 
                {role: 'Retention Manager'},
                {role: 'Conversion Manager'},
                {role: 'Retention Agent'},
                {role: 'Conversion Agent'},
                {role: 'Manager'},
                {role: 'Administrator'},
                {role: 'Developer'},
            ];
            break;
        case('Administrator'):
            responce = [{role: 'CRM Manager'}, 
                {role: 'Retention Manager'},
                {role: 'Conversion Manager'},
                {role: 'Retention Agent'},
                {role: 'Conversion Agent'},
                {role: 'Manager'},
                {role: 'Administrator'},
            ];
            break;
        case('Manager'):
            responce = [{role: 'CRM Manager'}, 
                {role: 'Retention Manager'},
                {role: 'Conversion Manager'},
                {role: 'Retention Agent'},
                {role: 'Conversion Agent'},
                {role: 'Manager'},
            ];
            break;
        case('CRM Manager'):
            responce = [ 
                {role: 'Retention Manager'},
                {role: 'Conversion Manager'},
                {role: 'Retention Agent'},
                {role: 'Conversion Agent'},
            ];
            break;
        case('Retention Manager'):
            responce = [ 
                {role: 'Retention Agent'},
            ];
            break;
        case('Conversion Manager'):
            responce = [ 
                {role: 'Conversion Agent'},
            ];
            break;
        default:
            responce = [];
    };



    res.send(responce);
};


module.exports = {
    getRole: ctrlWrapper(getRole)
};