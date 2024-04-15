const { User } = require("../../models/user");
const {ctrlWrapper} = require("../../helpers/index");


const logout = async(req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.status(200).send({message: "You have successfully logged out"});
};


module.exports = {
    logout: ctrlWrapper(logout)
};
