const User = require("../models/User");

/**
 * Check if email already exist
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {fn} next
 */
const checkEmail = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user)
        return res.status(400).json({
          result: null,
          success: false,
          msg: "User with this email already exists",
        });
      next();
    })
    .catch((err) =>
      res.status(500).json({
        result: err,
        success: false,
        msg: "Internal server error",
        devmsg: "Internal server error @activateAccountController",
      })
    );
};

/**
 * Check if username already exist
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {fn} next
 */
const checkUsername = (req, res, next) => {
  const { username } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (user)
        return res.status(400).json({
          result: null,
          success: false,
          msg: "User with this username already exists",
        });
      next();
    })
    .catch((err) =>
      res.status(500).json({
        result: err,
        success: false,
        msg: "Internal server error",
        devmsg: "Internal server error @activateAccountController",
      })
    );
};

module.exports = {
  checkEmail,
  checkUsername,
};
