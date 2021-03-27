/**
 * @module router/complaint
 * @requires module:controller/complaint
 */
const router = require("express").Router();
const complaint = require("../controllers/complaint.controller");

/**
 * Create a new route [User]
 * @name post/create
 * @example {base_url}/complaints/new
 */
router.post("/new", complaint.createNewComplaintController);

/**
 * Update complaaint status [Authority]
 * @name patch/updateStatus
 * @example {base_url}/complaints/update/status
 */
router.patch("/update/status", complaint.updateComplaintStatusController);

/**
 * Upvote a complaint [User]
 * @name patch/upvote
 * @example {base_url}/complaints/update/upvote
 */
router.patch("/update/upvote", complaint.upvoteComplaintController);

/**
 * Comment on a complaint [Authority|User]
 * @name patch/comment
 * @example {base_url}/complaints/update/comment
 */
router.patch("/update/comment", complaint.commentOnComplaintController);

/**
 * Get all complaints [Admin]
 * @name get/allForAdmin
 * @example {base_url}/complaints/get/admin
 */
router.get("/get/admin", complaint.getAllComplaintsForAdminController);

/**
 * Get all complaints by status for admin [Admin]
 * @name get/allByStatusForAdmin
 * @example {base_url}/complaints/get/admin/status?q=processing
 */
router.get(
  "/get/admin/status",
  complaint.getAllComplaintsByStatusForAdminController
);

/**
 * Get all complaints by status for authority [Authority]
 * @name get/allByStatusForAuthority
 * @example {base_url}/complaints/get/authority/123?state=open
 */
router.get(
  "/get/authority/:authorityId",
  complaint.getAllComplaintsByStatusForAuthorityController
);

/**
 * Get own complaints [User]
 * @name get/own
 * @example {base_url}/complaints/get/my/123
 */
router.get("/get/my/:userId", complaint.getComplaintsByOwnerController);

/**
 * Get a complaint by id [*]
 * @name get/complaintById
 * @example {base_url}/complaints/get/one/123
 */
router.get("/get/one/:complaintId", complaint.getComplaintByIdController);

/**
 * Get complaints by category [Admin|Authority]
 * @name get/complaintsByCategory
 * @example {base_url}/complaints/get/cat/123
 */
router.get("/get/cat/:categoryId", complaint.getComplaintsByCategoryController);

/**
 * Get complaints by city [User]
 * @name get/complaintsByCity
 * @example {base_url}/complaints/get/all/city?q=homagama
 */
router.get("/get/all/city", complaint.getAllComplaintsByCityController);

/**
 * Get complaints by district [Authority]
 * @name get/complaintsByDistrict
 * @example {base_url}/complaints/get/all/district?q=colombo
 */
router.get("/get/all/district", complaint.getAllComplaintsByDistrictController);

/**
 * Confirm a complaint when it's done [User]
 * @name get/confirm
 * @example {base_url}/complaints/confirm/123/123
 */
router.get(
  "/confirm/:userId/:complaintId",
  complaint.confirmProgressDoneController
);

/**
 * Delete a complaint [Admin|User]
 * @name delete/complaint
 * @example {base_url}/complaints/rm/123
 */
router.delete("/rm/:complaintId", complaint.deleteComplaitByIdController);

module.exports = router;
