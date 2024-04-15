const {ctrlWrapper, HttpError} = require("../../helpers/index");
const bcrypt = require("bcryptjs");
const { User } = require("../../models/user");


const updateInfo = async(req, res) => {
    const { password, newPassword } = req.body;
    const { _id: userId, role } = req.user;
    const user = await User.findById(userId);

    if (role === 'guest') {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    }


    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
        throw HttpError(401, "Current password invalid");
    }


    if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
    }


    await user.save();

    res.send({ message: "Your password has been successfully updated" });
};


module.exports = {
    updateInfo: ctrlWrapper(updateInfo)
};