const { ctrlWrapper } = require("../../helpers");

const getAllStatus = async (req, res) => {

  const status = [
    "New",
    "N/A",
    "Wrong Number",
    "Wrong Person",
    "Potential",
    "Not Interested",
    "In the Money",
    "Call Back 1",
    "Call Back 2",
    "Call Back 3",
    "Not Potential",
    "ReAssign",
    "Never Answer",
  ];

  res.status(200).send(status);
};

module.exports = {
  getAllStatus: ctrlWrapper(getAllStatus),
};
