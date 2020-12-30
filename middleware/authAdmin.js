const Users = require('../models/userModels');

const authAdmin = async (req, res, next) => {
  try {
    const user = await Users.findOne({ _id: req.user.id });

    if (user.role === 0)
      return res.status(400).json({ message: 'Need admin privileges' });

    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = authAdmin;
