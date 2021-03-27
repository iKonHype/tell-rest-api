/**
 * @module middleware/authChecker
 */
const expressJwt = require("express-jwt");

/**
 * Check whether user has a valid token
 */
exports.isSignedIn = expressJwt({
  secret: process.env.SIGN_TOKEN_SECRET,
  userProperty: "auth",
  algorithms: ["sha1", "RS256", "HS256"],
});

const getProfile = (req, res, next) => {};

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
    return res.status(403).json({
      result: null,
      success: false,
      msg: "Unauthorized Action",
    });
  }
  console.log("Authorized user:", req.body.userId);
  next();
};

exports.isAdmin = (req, res, next) => {};

exports.isAuthority = (req, res, next) => {};
