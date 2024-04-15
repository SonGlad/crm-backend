const {ctrlWrapper} = require("../../helpers/index");


const getCurrent = async(req, res) => {
    const {username, email, avatarURL, role} = req.user;

    if (role === 'guest') {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    }

    res.send({username, email, avatarURL, role});
};


module.exports = {
    getCurrent: ctrlWrapper(getCurrent)
};