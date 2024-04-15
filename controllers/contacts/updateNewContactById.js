const { Contact } = require("../../models/contact");
const {HttpError, ctrlWrapper} = require("../../helpers/index");


const updateNewContactById = async (req, res) => {
    const { contactId } = req.params;
    const { role } = req.user;
    const { newContact } = req.body;

    if (role === 'guest' || role === 'user') {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    }

    const existingContact = await Contact.findById(contactId);

    if (!existingContact) {
        throw HttpError(404, "Contact was not found");
    }


    if (newContact === undefined) {
        return res.status(400).json({ message: "missing field new contact" });
    }
  
    const result = await Contact.findByIdAndUpdate(contactId, {newContact}, {new: true});
  
    res.status(200).send(result);
};


module.exports = {
    updateNewContactById: ctrlWrapper(updateNewContactById)
};