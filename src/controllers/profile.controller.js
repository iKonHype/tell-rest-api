/**
 * @module controller/profile
 * @requires module:service/profile
 */

const ProfileService = require("../services/ProfileService");

//#region User

/**
 * Update user profile [User]
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.updateUserController = async (req, res) => {
  try {
    const { result, success } = await ProfileService.updateUserProfile(
      req.body
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Profile update failed",
      });
    }
    return res.status(201).json({
      result,
      success,
      msg: "Update success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Get user profile [Admin|User]
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.getUserProfileController = async (req, res) => {
  try {
    const { result, success } = await ProfileService.readUserProfile(
      req.params.userId
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "getprofilebyId failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "profile read success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error on get readController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Delete user profile [Admin|User]
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.deleteUserProfileController = async (req, res) => {
  try {
    const { result, success } = await ProfileService.deleteUserProfile(
      req.params.userId
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Profile deletion failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Delete success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @deleteProfilebyId",
      err: error.message,
      success: false,
    });
  }
};
//#endregion

//#region Authority

/**
 * Update authority profile [Admin|Authority]
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.updateAuthoritynProfileController = async (req, res) => {
  try {
    const { result, success } = await ProfileService.updateAuthorityProfile(
      req.body
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "auth update failed",
      });
    }
    return res.status(201).json({
      result,
      success,
      msg: "auth success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Get authority profile [Admin|Authority]
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.getAuthorityProfileController = async (req, res) => {
  try {
    const { result, success } = await ProfileService.readAuthorityProfile(
      req.params.userId
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "admin get failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "admin read success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error on get readController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Delete authortiy profile [Admin]
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.deleteAuthorityProfileController = async (req, res) => {
  try {
    const { result, success } = await ProfileService.deleteAuthorityProfile(
      req.params.userId
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Profile deletion failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Delete success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @deleteProfilebyId",
      err: error.message,
      success: false,
    });
  }
};
//#endregion
