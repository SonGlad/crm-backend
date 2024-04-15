const { ctrlWrapper, HttpError, sendEmail } = require("../../helpers/index");
const { User } = require("../../models/user");
require("dotenv").config();
const bcrypt = require("bcryptjs");


const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  
  const temporaryPassword = Math.random().toString(36).slice(-8);
  const hashedTemporaryPassword = await bcrypt.hash(temporaryPassword, 10);
  await User.findByIdAndUpdate(user._id, { password: hashedTemporaryPassword });


  const resetPasswordEmail = {
    to: email,
    subject: "Temporary Password",
    text: `Your temporary password is: ${temporaryPassword}`,
  };

  await sendEmail(resetPasswordEmail);

  res.send({ message: "Temporary password sent" });
};


module.exports = {
  forgotPassword: ctrlWrapper(forgotPassword),
};

