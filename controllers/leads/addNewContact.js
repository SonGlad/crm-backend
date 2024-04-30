const { Contact } = require("../../models/contact");
const { ctrlWrapper, HttpError } = require("../../helpers/index");


const addNewContact =  async (req, res) => {
    const {_id: owner, role} = req.user;
    const { ...contactData } = req.body;
   

    if (role === 'guest' || role === 'user') {
      return res.status(403).send({ message: 'Forbidden: Access denied' });
    }

    const existingContact = await Contact.findOne({ ...contactData });

    if (existingContact) {
        throw HttpError(400, "Contact already exists" );
    }

    const result = await Contact.create({ ...contactData, owner});

    res.status(201).send(result);
};


module.exports = {
    addNewContact: ctrlWrapper(addNewContact)
};


