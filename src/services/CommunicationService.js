/**
 * @module service/communication
 * @requires module:helpers/generateOTP
 */

const generateOTP = require("../helpers/generateOTP");
const axios = require("axios");

axios.default({
  baseURL: "https://us-central1-sewa-5df00.cloudfunctions.net/app",
  timeout: 10000,
  timeoutErrorMessage:
    "Request timeout! Please check your internet connection...",
});

exports.api = {
  // anyEmail: (email, subject, body) =>
  //   axios.post("/email/send", {
  //     userEmail: email,
  //     emaailSubject: subject,
  //     emailBody: body,
  //   }),
  // complaintAccept: (email, name, complaintId, complaintTitle) =>
  //   axios.post("/email/accept", {
  //     userEmail: email,
  //     userFirstName: name,
  //     complaintID: complaintId,
  //     complaintTitle,
  //   }),
  // complaintReject: (email, name, complaintId, complaintTitle) =>
  //   axios.post("/email/reject", {
  //     userEmail: email,
  //     userFirstName: name,
  //     complaintID: complaintId,
  //     complaintTitle,
  //   }),
  // complaintComplete: (email, name, complaintId, complaintTitle, link) =>
  //   axios.post("/email/complete", {
  //     serEmail: email,
  //     userFirstName: name,
  //     complaintID: complaintId,
  //     complaintTitle,
  //     link,
  //   }),
};
