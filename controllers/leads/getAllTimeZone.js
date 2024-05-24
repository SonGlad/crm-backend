const { ctrlWrapper } = require("../../helpers");

const getAllTimeZone = async (req, res) => {

  const timeZone = [
    -12,
    -11,
    -10,
    -9,
    -8,
    -7,
    -6,
    -5,
    -4,
    -3,
    -2,
    -1,
    0,
    +1,
    +2,
    +3,
    +4,
    +5,
    +6,
    +7,
    +8,
    +9,
    +10,
    +11,
    +12
  ];

  res.status(200).send(timeZone);
};

module.exports = {
  getAllTimeZone: ctrlWrapper(getAllTimeZone),
};