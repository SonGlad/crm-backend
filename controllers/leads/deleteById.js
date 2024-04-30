const { Contact } = require("../../models/contact");
const {HttpError, ctrlWrapper} = require("../../helpers/index");


const deleteById = async (req, res) => {
  const { contactId } = req.params;
  const { role } = req.user;

  if (role === 'guest' || role === 'user') {
    return res.status(403).send({ message: 'Forbidden: Access denied' });
  }

  const result = await Contact.findOneAndDelete({ _id: contactId});
  

  if (!result) {
    throw HttpError(404, "Contact was not found");
  };

  res.status(200).send({_id: result._id, message: "Contact Deleted"});
};


module.exports = {
  deleteById: ctrlWrapper(deleteById)
};