const { Contact } = require("../../models/contact");
const {HttpError, ctrlWrapper} = require("../../helpers/index");


const updateById = async (req, res) => {
  const { contactId } = req.params;
  const { role } = req.user;

  if (role === 'guest' || role === 'user') {
    return res.status(403).send({ message: 'Forbidden: Access denied' });
  }

  const result = await Contact.findOneAndUpdate({ _id: contactId}, req.body, { new: true });
  
  if (!result) {
    throw HttpError(404, "Contact was not found");
  };

  res.status(200).send(result);
};


module.exports = {
  updateById: ctrlWrapper(updateById)
};