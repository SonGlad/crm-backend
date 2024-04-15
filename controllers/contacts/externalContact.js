const { Contact } = require("../../models/contact");
const { ctrlWrapper, HttpError, sendEmail } = require("../../helpers/index");
require("dotenv").config();

const { ADMIN_EMAIL} = process.env;


const externalContact = async (req, res) => {
    const { ...contactData } = req.body;

    const existingContact = await Contact.findOne({ ...contactData });

    if (existingContact) {
        throw HttpError(400, "Contact already exists" );
    }

    await Contact.create({ ...contactData });

    const { name, lastName, email, phone, resource } = contactData;

    const newContactEmail = {
        to: ADMIN_EMAIL,
        subject: `New Contact created at ${resource} resource`,
        html: `
        <p>The New User has been registered:</p>
        <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Last name:</strong> ${lastName}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Resource:</strong> ${resource}</li>
        </ul>
        `
    }
    await sendEmail(newContactEmail);

    res.status(201).send({ message: 'New Contact Created'});
};


module.exports = {
    externalContact: ctrlWrapper(externalContact)
};