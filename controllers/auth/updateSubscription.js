// const { HttpError, ctrlWrapper} = require("../../helpers/index");
// const { User } = require("../../models/user");



// const updateSubscription = async (req, res) => {
//   const { subscription } = req.body;
//   const { _id: userId } = req.user;

//   if (!['starter', 'pro', 'business'].includes(subscription)) {
//     throw HttpError(400, "Invalid subscription value");
//   }

//   const updatedUser = await User.findByIdAndUpdate(
//     userId,
//     { subscription },
//     { new: true }
//   );

//   if (!updatedUser) {
//     throw HttpError(404, "User not found");
//   }

//   res.status(200).send(updatedUser);
// };
  


// module.exports = {
//   updateSubscription: ctrlWrapper(updateSubscription)
// };