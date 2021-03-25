/**
 * @module service/profile
 * @require module:model/user
 */
const User = require("../models/User");

/**
 * Update user profile
 * @async
 * @param {object} payload HTTP request body
 * @returns {defaultReturnType} Updated profile
 */
exports.updateProfile = async (payload) => {
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

//dispaly/read profile
exports.readProfile = async (userId) => {
  try {
    const result = await User.findById(userId);
    if (!result) return { result, success: false };

    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
  //const result=await User.
};

//delete profile

exports.deleteProfile = async (userId) => {
  try {
    const result = await User.findByIdAndDelete(userId);

    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};
