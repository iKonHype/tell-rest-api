/**
 * @module controller/auth
 * @requires module:service/auth
 */

const authService = require("../services/AuthService");

/**
 * Sent verification mail on sign-up
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.signupController = (req, res) => {
  try {
    const { result, success } = authService.signup(req.body);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "signup failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Signup successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @signupController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Register user account and activate
 * @param {HTTP} req
 * @param {HTTP} res
 * @@returns {Response}
 */
exports.activateAccountController = (req, res) => {
  try {
    const { result, success } = authService.activate(req.body);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Couldn't register user. Please Try again later",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "You have been registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      result: null,
      success: false,
      msg: "Internal server error @activateAccountController",
    });
  }
};

/**
 * Sign-in user
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.signinController = (req, res) => {
  try {
    const { result, success } = authService.signin(req.body);
    if (!success)
      return res.status(400).json({ result, success, msg: "signin failed" });

    return res.status(200).json({
      result,
      success,
      msg: "Singin success",
    });
  } catch (error) {
    return res.status(500).json({
      result,
      success,
      msg: "Internal server error @signinController",
    });
  }
};

/**
 * Send a new sign token and new refresh token
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.refreshTokenController = (req, res) => {
  const { result, success } = authService.refresh(req.body);
  if (!success) {
    return res.status(401).json({
      result,
      success,
      msg: "Unauthorized",
    });
  }
  return res.status(200).json({
    result,
    success,
    msg: "Tokens refreshed",
  });
};

/**
 * Signout a user
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
// FIXME: sign out controller logic and structure
exports.signoutController = (req, res) => {
  try {
    req.profile = undefined;
    return res.clearCookie("token").json({
      msg: "User has signout successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
