/**
 * @module router/complaint
 * @requires module:controller/complaint
 */
const router = require("express").Router();
const complaint = require("../controllers/complaint.controller");
const checkpoint = require("../middlewares/checkpoint");

/**
 * Create a new route [User]
 * @name post/create
 * @example {base_url}/complaints/new
 */
router.post(
  "/new",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  complaint.createNewComplaintController
);

/**
 * Update complaaint status [Authority]
 * @name patch/updateStatus
 * @example {base_url}/complaints/update/status
 */
router.patch(
  "/update/status",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  checkpoint.isAuthority,
  complaint.updateComplaintStatusController
);

/**
 * Upvote a complaint [User]
 * @name patch/upvote
 * @example {base_url}/complaints/update/upvote
 */
router.patch(
  "/update/upvote",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  complaint.upvoteComplaintController
);

/**
 * Comment on a complaint [Authority|User]
 * @name patch/comment
 * @example {base_url}/complaints/update/comment
 */
router.patch(
  "/update/comment",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  complaint.commentOnComplaintController
);

/**
 * Get all complaints [Admin]
 * @name get/allForAdmin
 * @example {base_url}/complaints/get/admin
 */
router.get(
  "/get/admin/:userId",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  checkpoint.isAdmin,
  complaint.getAllComplaintsForAdminController
);

/**
 * Get all complaints by status for admin [Admin]
 * @name get/allByStatusForAdmin
 * @example {base_url}/complaints/get/admin/status?q=processing
 */
router.get(
  "/get/admin/status",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  checkpoint.isAdmin,
  complaint.getAllComplaintsByStatusForAdminController
);

/**
 * Get all complaints by status for authority [Authority]
 * @name get/allByStatusForAuthority
 * @example {base_url}/complaints/get/authority/123?state=open
 */
router.get(
  "/get/authority/:authorityId",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  checkpoint.isAuthority,
  complaint.getAllComplaintsByStatusForAuthorityController
);

/**
 * Get own complaints [User]
 * @name get/own
 * @example {base_url}/complaints/get/my/123
 */
router.get(
  "/get/my/:userId",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  complaint.getComplaintsByOwnerController
);

/**
 * Get a complaint by id [*]
 * @name get/complaintById
 * @example {base_url}/complaints/get/one/123
 */
router.get(
  "/get/one/:complaintId",
  checkpoint.isSignedIn,
  complaint.getComplaintByIdController
);

/**
 * Get complaints by category [Admin|Authority]
 * @name get/complaintsByCategory
 * @example {base_url}/complaints/get/cat/123
 */
router.get(
  "/get/cat/:categoryId",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  checkpoint.isAuthority,
  complaint.getComplaintsByCategoryController
);

/**
 * Get complaints by city [User]
 * @name get/complaintsByCity
 * @example {base_url}/complaints/get/all/city?q=homagama
 */
router.get(
  "/get/all/:userId",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  complaint.getAllComplaintsByCityController
);

/**
 * Get complaints by district [Authority]
 * @name get/complaintsByDistrict
 * @example {base_url}/complaints/get/all/district?q=colombo
 */
router.get(
  "/get/all/district",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  checkpoint.isAuthority,
  complaint.getAllComplaintsByDistrictController
);

/**
 * Confirm a complaint when it's done [User]
 * @name get/confirm
 * @example {base_url}/complaints/confirm/123/123
 */
router.get(
  "/confirm/:userId/:complaintId",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  complaint.confirmProgressDoneController
);

/**
 * Delete a complaint [Admin|User]
 * @name delete/complaint
 * @example {base_url}/complaints/rm/123
 */
router.delete(
  "/rm/:complaintId",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  complaint.deleteComplaitByIdController
);

// router.post("/testmail", async (req, res) => {
//   try {
//     const emailBody = {
//       userEmail: "alwiskaveen@gmail.com",
//       userFirstName: "Kaveen",
//       complaintID: "6bf334567y778",
//       complaintTitle: "කුනු අයින් කරපන් යකෝ...",
//     };
//     const { result, success } = await acceptEmail(
//       emailBody.userEmail,
//       emailBody.userFirstName,
//       emailBody.complaintID,
//       emailBody.complaintTitle
//     );
//     res.status(200).json({ result, success, msg: "කුනු අයින් කරපන් යකෝ" });
//   } catch (error) {
//     res.status(500).json("කුනු අයින් කරපන් යකෝ");
//   }
// });

module.exports = router;
