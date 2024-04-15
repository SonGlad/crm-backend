const {ctrlWrapper} = require("../../helpers/index");
const { User } = require("../../models/user");


const updateAvatar = async (req, res) => {
    const { _id, role } = req.user;
    const avatarURL = req.file.path;

    if (role === 'guest') {
      return res.status(403).send({ message: 'Forbidden: Access denied' });
    }
  
    const updatedUser = await User.findOneAndUpdate(
      { _id },
      { avatarURL },
      { new: true }
    );
  
    res.json({ avatarURL: updatedUser.avatarURL });
  };


  module.exports = {
    updateAvatar: ctrlWrapper(updateAvatar)
};