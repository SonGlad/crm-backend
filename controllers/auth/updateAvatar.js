const {ctrlWrapper} = require("../../helpers/index");
const { User } = require("../../models/MainUser");
const { Office1User } = require ("../../models/Office1User");
const { Office2User } = require ("../../models/Office2User");


const updateAvatar = async (req, res) => {
  const { _id, role, branch } = req.user;
  const {role: authRole, branch: authBranch} = req.auth;
  const avatarURL = req.file.path;
  

  if (authRole !== role || authBranch !== branch) {
    return res.status(403).send({ message: 'Forbidden: Access denied' });
  };


  let updatedUser;


  switch(authBranch){
    case 'Main':
      updatedUser = await User.findOneAndUpdate(
        { _id },
        { avatarURL },
        { new: true }
      );
      break;
    case 'Office1':
      updatedUser = await Office1User.findOneAndUpdate(
          { _id },
          { avatarURL },
          { new: true }
      );
      break;
    case 'Office2':
      updatedUser = await Office2User.findOneAndUpdate(
          { _id },
          { avatarURL },
          { new: true }
      );
      break;
    default:
      return res.status(404).send({ message: 'User not found' });
  }


  res.json({ avatarURL: updatedUser.avatarURL });
};


module.exports = {
  updateAvatar: ctrlWrapper(updateAvatar)
};