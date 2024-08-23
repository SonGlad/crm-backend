const {ctrlWrapper} = require("../../helpers/index");


const getCurrent = async(req, res) => {
    const {username, avatarURL, role, branch, email} = req.user;
    const {role: authRole, branch: authBranch} = req.auth;


    if (authRole !== role || authBranch !== branch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };

    res.send({
        username, 
        avatarURL, 
        role,
        branch,
        email
    });
};


module.exports = {
    getCurrent: ctrlWrapper(getCurrent)
};