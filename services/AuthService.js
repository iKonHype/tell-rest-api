const User = require("../models/User");
const { sendVerificationMail } = require("../services/CommunicationService");
const { encrypt, decrypt } = require("../helpers/cipherEngine");
const {
  signJWT,
  refreshJWT,
  encodeJWT,
  verifyJWT,
  verifyRefreshJWT,
} = require("../helpers/JWTEngine");

/**
 * @description Sent verification mail on sign-up
 * @param {Object} payload HTTP request body
 * @async
 */
const signup = async (payload) => {
  const { firstName, lastName, username, email, password } = payload;

  // encode user input in a jwt
  const JWTPayload = {
    firstName,
    lastName,
    username: encrypt(username),
    email: encrypt(email),
    password: encrypt(password),
  };

  const encodedRes = encodeJWT(JWTPayload);
  if (!encodedRes.success)
    return { result: encodedRes.result, success: encodedRes.success };
  const signupToken = encodedRes.result;

  // send mail and jwt
  try {
    const { result, success } = await sendVerificationMail(email, firstName);
    if (!success) return { result, success };

    return { result: { ...result, signupToken }, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * @description Register user account and activate
 * @param {Object} payload HTTP request body
 * @async
 */
const activate = async (payload) => {
  const { signupToken } = payload;

  const verifyRes = verifyJWT(signupToken); // <- decode signup token
  if (!verifyRes.success)
    return { result: verifyRes.result, success: verifyRes.success };
  const { firstName, lastName, username, email, password } = verifyRes.result;

  // save user into db
  const user = new User({
    firstName,
    lastName,
    username: decrypt(username),
    email: decrypt(email),
    password: decrypt(password),
  });

  try {
    const newUser = await user.save();
    if (!newUser) throw new Error("Couldn't save user to database");
    const { _id, role } = newUser;

    const signedRes = signJWT({ id: _id }); // <- Create the sign token
    if (!signedRes.success)
      return { result: signedRes.result, success: signedRes.success };
    const signToken = signedRes.result;

    const refreshRes = refreshJWT({ id: _id }); // <- Create the refresh token
    if (!refreshRes.success)
      return { result: refreshRes.result, success: refreshRes.success };
    const refToken = refreshRes.result;

    return {
      result: {
        id: _id,
        role,
        signToken,
        refToken,
      },
      success: true,
    };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * @description Sign-in user to the system
 * @param {Object} payload HTTP request body
 * @async
 */
const signin = async (payload) => {
  const { email, password } = payload;

  try {
    const user = await User.findOne({ email });

    if (!user) throw new Error("Email is not valid or not a registered user");
    if (!user.authenticate(password)) throw new Error("Password is not valid");

    const signedRes = signJWT({ id: user._id }); // <- Create the sign token
    if (!signedRes.success)
      return { result: signedRes.result, success: signedRes.success };
    const signToken = signedRes.result;

    const refreshRes = refreshJWT({ id: user._id }); // <- Create the refresh token
    if (!refreshRes.success)
      return { result: refreshRes.result, success: refreshRes.success };
    const refToken = refreshRes.result;

    return {
      result: {
        id: user._id,
        signToken,
        refToken,
      },
      success: true,
    };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * @description Refresh sign token
 * @param {Object} payload HTTP request body
 */
const refresh = (payload) => {
  const { refreshToken } = payload;

  const verifyRef = verifyRefreshJWT(refreshToken); // <- decode signup token
  if (!verifyRef.success)
    return { result: verifyRef.result, success: verifyRef.success };
  const id = verifyRef.result.id;

  const signedRes = signJWT({ id }); // <- Create the sign token
  if (!signedRes.success)
    return { result: signedRes.result, success: signedRes.success };
  const signToken = signedRes.result;

  const refreshRes = refreshJWT({ id }); // <- Create the refresh token
  if (!refreshRes.success)
    return { result: refreshRes.result, success: refreshRes.success };
  const refToken = refreshRes.result;

  return { result: { signToken, refToken, id }, success: true };
};

module.exports = {
  signup,
  activate,
  signin,
  refresh,
};
