const { Contact } = require("../../models/contact");
const { ctrlWrapper } = require("../../helpers/index");


const getAll = async (req, res) => {
    const { role } = req.user;

    if (role === 'guest' || role === 'user') {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    }

    // const { page = 1, limit = 20 } = req.query;
    // const skip = (page - 1) * limit;

    const result = await Contact.find()
        // .skip(parseInt(skip))
        // .limit(parseInt(limit))
        .populate("owner", "username email role");

    res.status(200).send(result);
};

module.exports = { 
    getAll: ctrlWrapper(getAll)
};
