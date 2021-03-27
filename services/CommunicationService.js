/**
 * @module service/communication
 */

const nodemailer = require("nodemailer");
const generateOTP = require("../helpers/generateOTP");
const needle = require("needle");
const baseUrl = "https://us-central1-sewa-5df00.cloudfunctions.net/app";

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

exports.acceptEmail = async (
  userEmail,
  userFirstName,
  complaintID,
  complaintTitle
) => {
  try {
    const response = await needle.post(`${baseUrl}/email/accept/`, {
      userEmail,
      userFirstName,
      complaintID,
      complaintTitle,
    });
    return { result: response, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};
