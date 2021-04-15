/**
 * @module service/auth
 * @requires module:model/user
 * @requires module:model/authority
 * @requires module:service/communication
 * @requires module:helpers/cipherEngine
 * @requires module:helpers/JWTEngine
 */

const User = require("../models/User");
const Authority = require("../models/Authority");
const { sendVerificationMail } = require("../services/CommunicationService");
const { encrypt, decrypt } = require("../helpers/cipherEngine");
const otpGen = require("../helpers/generateOTP");
const {
  signJWT,
  refreshJWT,
  encodeJWT,
  verifyJWT,
  verifyRefreshJWT,
} = require("../helpers/JWTEngine");

//#region User

/**
 * @description Sent verification mail on sign-up
 * @param {Object} payload HTTP request body
 * @async
 * @returns {defaultReturnType} The encoded JWT signup token
 */
exports.signup = async (payload) => {
  const { firstName, lastName, contact, email, password } = payload;

  // encode user input in a jwt
  const JWTPayload = {
    firstName,
    lastName,
    contact: encrypt(contact),
    email: encrypt(email),
    password: encrypt(password),
  };

  const encodedRes = encodeJWT(JWTPayload);
  if (!encodedRes.success)
    return { result: encodedRes.result, success: encodedRes.success };
  const signupToken = encodedRes.result;

  const otp = otpGen();

  // send mail and jwt
  try {
    //FIXME: email isse #01
    // const { result, success } = await sendVerificationMail(email, firstName);
    // if (!success) return { result, success };

    return { result: { otp, signupToken }, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * @description Register user account and activate
 * @param {Object} payload HTTP request body
 * @async
 * @returns {defaultReturnType} User id, role, signToken and refToken
 */
exports.activate = async (payload) => {
  const { signupToken } = payload;

  const verifyRes = verifyJWT(signupToken); // <- decode signup token
  if (!verifyRes.success)
    return { result: verifyRes.result, success: verifyRes.success };
  const { firstName, lastName, contact, email, password } = verifyRes.result;

  // save user into db
  const user = new User({
    firstName,
    lastName,
    contact: decrypt(contact),
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
 * @returns {defaultReturnType} User id, refToken and signToken
 */
exports.signin = async (payload) => {
  const { email, password } = payload;

  try {
    const user = await User.findOne({ email });

    if (!user) throw new Error("Email is not valid or not a registered user");
    if (!user.authenticate(password)) throw new Error("Password is not valid");

    const signedRes = signJWT({ id: user._id, role: user.role }); // <- Create the sign token
    if (!signedRes.success)
      return { result: signedRes.result, success: signedRes.success };
    const signToken = signedRes.result;

    const refreshRes = refreshJWT({ id: user._id, role: user.role }); // <- Create the refresh token
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
//#endregion

//#region Authority

/**
 * Create a new authority profile [Admin]
 * @param {string} authorityName
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} contact
 * @param {string} district
 * @returns {defaultReturnType} Saved authority doc
 */
exports.createAuthorityProfile = async (
  authorityName,
  username,
  email,
  password,
  contact,
  district
) => {
  try {
    const authority = new Authority({
      authorityName,
      username,
      email,
      password,
      contact,
      district,
    });

    const result = await authority.save();
    if (!result) return { result, success: false };
    result.encry_password = undefined;
    result.salt = undefined;
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * Authoritty sign-in [Authority]
 * @param {String} username
 * @param {String} password
 * @returns Authority id and tokens
 */
exports.authoritySignIn = async (username, password) => {
  try {
    const authority = await Authority.findOne({ username });

    if (!authority)
      throw new Error("Email is not valid or not a registered authority");
    if (!authority.authenticate(password))
      throw new Error("Password is not valid");

    const signedRes = signJWT({ id: authority._id, role: authority.role }); // <- Create the sign token
    if (!signedRes.success)
      return { result: signedRes.result, success: signedRes.success };
    const signToken = signedRes.result;

    const refreshRes = refreshJWT({ id: authority._id, role: authority.role }); // <- Create the refresh token
    if (!refreshRes.success)
      return { result: refreshRes.result, success: refreshRes.success };
    const refToken = refreshRes.result;

    return {
      result: {
        id: authority._id,
        role: authority.role,
        signToken,
        refToken,
      },
      success: true,
    };
  } catch (error) {
    return { result: error.message, success: false };
  }
};
//#endregion

//#region Common

/**
 * @description Refresh sign token
 * @param {Object} payload HTTP request body
 * @returns {defaultReturnType} SignToken and refToken
 */
exports.refresh = (payload) => {
  const { refreshToken } = payload;

  const verifyRef = verifyRefreshJWT(refreshToken); // <- decode signup token
  if (!verifyRef.success)
    return { result: verifyRef.result, success: verifyRef.success };

  const { id, role } = verifyRef.result;

  const signedRes = signJWT({ id, role }); // <- Create the sign token
  if (!signedRes.success)
    return { result: signedRes.result, success: signedRes.success };
  const signToken = signedRes.result;

  const refreshRes = refreshJWT({ id, role }); // <- Create the refresh token
  if (!refreshRes.success)
    return { result: refreshRes.result, success: refreshRes.success };
  const refToken = refreshRes.result;

  return { result: { signToken, refToken, id }, success: true };
};
//#endregion
