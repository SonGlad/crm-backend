const {ctrlWrapper} = require("../../helpers/index");


const getRole = async(req, res) => {
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
            responce = [{role: 'CRM Manager'}, 
            {role: 'Retention Manager'},
            {role: 'Conversion Manager'},
            {role: 'Retention Agent'},
            {role: 'Conversion Agent'},
        ];
    } else if(authRole === "CRM Manager" && (authBranch === "Office1" || authBranch === "Office2")){
        responce = [{role: 'Retention Manager'},
        {role: 'Conversion Manager'},
        {role: 'Retention Agent'},
        {role: 'Conversion Agent'},
    ];
    } else if(authRole === "Retention Manager" && (authBranch === "Office1" || authBranch === "Office2")){
        responce = [{role: 'Retention Agent'}];
    } else if(authRole === "Conversion Manager" && (authBranch === "Office1" || authBranch === "Office2")){
        responce = [{role: 'Conversion Agent'}];
    } else {
        responce = [];
    };


    res.send(responce);
};


module.exports = {
    getRole: ctrlWrapper(getRole)
};