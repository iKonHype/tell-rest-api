/**
 * @module middleware/checkpoint
 * @requires module:model/user
 */

const expressJwt = require("express-jwt");
const User = require("../models/User");

/**
 * Check if email already exist
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {fn} next
 */
exports.isEmailExist = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user)
        return res.status(422).json({
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
exports.isUsernameExist = (req, res, next) => {
  const { username } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (user)
        return res.status(422).json({
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

/**
 * Check whether user has a valid token
 * @property {string} secret secret for enc and dec
 * @property {object} userProperty save current user token data
 * @property {string[]} algorithms Used algo to enc and dec
 */
exports.isSignedIn = expressJwt({
  secret: process.env.SIGN_TOKEN_SECRET,
  userProperty: "auth",
  algorithms: ["sha1", "RS256", "HS256"],
});

/**
 * Check whether user token id is same as the user id
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {fn} next
 * @returns authentication
 */
exports.isAuthenticated = (req, res, next) => {
  const isOwner =
    (req.auth.id == req.body.userId || req.auth.id == req.params.userId) ??
    false;
  if (!isOwner) {
    return res.status(401).json({
      result: null,
      success: false,
      msg: "Unauthorized Action",
    });
  }
  next();
};

/**
 * Check if user is an authority profile
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {fn} next
 */
exports.isAuthority = async (req, res, next) => {
  const isAuthority = req.auth.role === 49;
  if (!isAuthority)
    return res.status(403).json({
      result: null,
      success: false,
      msg: "403! Forbidden",
    });
  next();
};

/**
 * Check if the user is the admin
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {fn} next
 */
exports.isAdmin = async (req, res, next) => {
  const isAdmin = req.auth.role === 99;
  if (!isAdmin)
    return res.status(403).json({
      result: null,
      success: false,
      msg: "403! Forbidden",
    });
  next();
};
