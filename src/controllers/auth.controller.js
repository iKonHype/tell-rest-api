/**
 * @module controller/auth
 * @requires module:service/auth
 */

const authService = require("../services/AuthService");

//#region User
/**
 * Sent verification mail on sign-up
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.signupController = async (req, res) => {
  try {
    const { result, success } = await authService.signup(req.body);
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
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @@returns {Response}
 */
exports.activateAccountController = async (req, res) => {
  try {
    const { result, success } = await authService.activate(req.body);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Couldn't register user. Please Try again later",
      });
    }
    return res.status(201).json({
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
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.signinController = async (req, res) => {
  try {
    const { result, success } = await authService.signin(req.body);
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
//#endregion

//#region Authority

/**
 * Create authority [Admin]
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.createAuthorityProfileController = async (req, res) => {
  try {
    const { authorityName, username, email, password, contact } = req.body;
    console.log("Req Body", req.body);
    const { result, success } = await authService.createAuthorityProfile(
      authorityName,
      username,
      email,
      password,
      contact
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Creation failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Creation success",
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
 * Sign-in authority
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.signinAuthorityController = async (req, res) => {
  const { username, password } = req.body;
  try {
    const { result, success } = await authService.authoritySignIn(
      username,
      password
    );
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
//#endregion

//#region Common

exports.resetPasswordController = async (req, res) => {
  try {
    const { result, success } = await authService.resetPassword(req.body);
    if (!success)
      return res
        .status(400)
        .json({ result, success, msg: "Password reset failed" });

    return res.status(200).json({
      result,
      success,
      msg: "Password reset success",
    });
  } catch (error) {
    return res.status(500).json({
      result,
      success,
      msg: "Internal server error @resetPasswordController",
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
//#endregion
