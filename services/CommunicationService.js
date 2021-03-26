/**
 * @module service/communication
 */

const nodemailer = require("nodemailer");
const generateOTP = require("../helpers/generateOTP");

/**
 * @description Send verification email
 * @param {String} userEmail Receiver email
 * @param {String} userFirstName Receiver first name
 * @async
 */
exports.sendVerificationMail = async (userEmail, userFirstName) => {
  const OTP = generateOTP();
  // TODO: get email service from tell-com-service
  return { result: null, success: true };
};
