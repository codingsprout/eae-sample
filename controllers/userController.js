const Users = require('../models/userModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userControl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await Users.findOne({ email });

      if (user)
        return res
          .status(400)
          .json({ message: 'User with email already exists' });

      if (password.length < 6)
        return res
          .status(400)
          .json({ message: 'Password must be at least 6 characters long' });

      const hash_password = await bcrypt.hash(password, 10);
      const newUser = new Users({ name, email, password: hash_password });

      await newUser.save();

      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accesstoken });

      //res.json({ message: 'Register successful' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });

      if (!user)
        return res.status(400).json({ message: 'User does not exist' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: 'Incorrect Password' });

      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
      return res.json({ message: 'Logged out successfully' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ message: 'Please login or register' });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ message: 'Please login or register' });

        const accesstoken = createAccessToken({ id: user.id });
        res.json({ user, accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getUserInfo: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select('-password');
      if (!user)
        return res.status(400).json({ message: 'User does not exist' });

      res.json(user);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user)
        return res.status(400).json({ message: 'User does not exist' });

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );
      return res.json({ message: 'Added to cart' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

module.exports = userControl;
