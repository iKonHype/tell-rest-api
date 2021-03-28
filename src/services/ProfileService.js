/**
 * @module service/profile
 * @requires module:model/user
 * @requires module:model/authority
 */
const User = require("../models/User");
const Authority = require("../models/Authority");

//#region  User Profile

/**
 * Update user profile
 * @async
 * @param {object} payload HTTP request body
 * @returns {defaultReturnType} Updated profile
 */
exports.updateUserProfile = async (payload) => {
  try {
    const userId = payload.userId;
    payload.userId = undefined;

    const result = await User.findByIdAndUpdate(
      userId,
      {
        $set: payload,
      },
      { new: true }
    );
    if (!result) return { result, success: false };

    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * Get user profile
 * @param {objectId} userId
 * @returns {defaultReturnType} user profile
 */
exports.readUserProfile = async (userId) => {
  try {
    const result = await User.findById(userId).select("-salt -encry_password");
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * Delete a user by id
 * @param {objectId} userId
 * @returns {defaultReturnType}
 */
exports.deleteUserProfile = async (userId) => {
  try {
    const result = await User.findByIdAndDelete(userId);
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};
//#endregion

//#region  Authority profile

/**
 * Get authority profile by id [Admin|Authority]
 * @async
 * @param {objectId} authorityId
 * @returns {defaultReturnType}
 */
exports.readAuthorityProfile = async (authorityId) => {
  try {
    const result = await Authority.findById(authorityId).select(
      "-salt -encry_password"
    );
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * Update authority profile [Admin]
 * @async
 * @param {object} payload
 * @returns
 */
exports.updateAuthorityProfile = async (payload) => {
  try {
    const userId = payload.userId;
    payload.userId = undefined;

    const result = await Authority.findByIdAndUpdate(
      userId,
      {
        $set: payload,
      },
      { new: true }
    );
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * Delete authority profile [Admin]
 * @async
 * @param {objectId} authorityId
 * @returns {defaultReturnType}
 */
exports.deleteAuthorityProfile = async (authorityId) => {
  try {
    const result = await Authority.findByIdAndDelete(authorityId);
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};
//#endregion
