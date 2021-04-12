/**
 * @module service/complaint
 * @requires module:model/complaint
 */

const Complaint = require("../models/Complaint");
const User = require("../models/User");

/**
 * Create a new complaint [User]
 * @async
 * @param {objectId} userId Complainer: owner
 * @param {string} content
 * @param {objectId} category
 * @param {Location} location
 * @param {string} landmark
 * @param {string} media
 * @returns {defaultReturnType}
 */
exports.createNewComplaint = async (
  userId,
  title,
  content,
  location,
  landmark,
  media
) => {
  try {
    const complaint = new Complaint({
      owner: userId,
      title,
      content,
      location,
      landmark,
      media,
    });

    console.log("Complainttttttttt", complaint);

    const result = await complaint.save();
    if (!result) return { result: null, success: false };
    console.log("Saving complaint populate user", result);

    const saveComplaintsInUser = await User.findByIdAndUpdate(
      userId,
      { $push: { complaints: result._id } },
      { new: true }
    );
    if (!saveComplaintsInUser) return { result: null, success: false };

    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * Update complaint status [Admin|Authority]
 * @async
 * @param {objectId} userId Admin or Authority
 * @param {objectId} complaintId
 * @param {string} complaintState ['open'|'accepted'|'rejected'|'processing'|'done'|'confirmed']
 * @returns {defaultReturnType}
 */
exports.updateComplaintStatus = async (
  userId,
  complaintId,
  complaintState,
  reason
) => {
  reason = reason ?? "Reason is not defined";
  try {
    const result = await Complaint.findOneAndUpdate(
      { authority: userId, _id: complaintId },
      {
        $set: { status: complaintState },
      },
      { new: true }
    ).populate({ path: "owner", select: "email contact firstName" });

    //TODO: send email throuh communication service
    //TODO: send SMS through communication service
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * Comment on a complaint for suggestion and more info
 * @async
 * @param {objectId} userId Complainer: any
 * @param {objectId} complaintId
 * @param {string} content
 * @returns {defaultReturnType}
 */
exports.commentOnComplaint = async (userId, complaintId, content) => {
  try {
    const comments = { commentor: userId, content };

    const result = await Complaint.findByIdAndUpdate(
      complaintId,
      { $push: { comments } },
      { new: true }
    );
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error, success: false };
  }
};

/**
 * Upvote a complaint to change priority [User]
 * @async
 * @param {objectId} userId Complainer: any
 * @param {objectId} complaintId
 * @returns {defaultReturnType}
 */
exports.upvoteComplaint = async (userId, complaintId) => {
  try {
    // check if user upvoted before
    const complaint = await Complaint.findOne({
      _id: complaintId,
      votes: userId,
    });
    if (complaint) {
      // if upvoted pull user
      const removeVote = await Complaint.findByIdAndUpdate(
        complaintId,
        { $pull: { votes: userId } },
        { new: true }
      );
      if (!removeVote) return { result: removeVote, success: false };
      return { result: removeVote, success: true };
    } else {
      // if not upvoted push user
      const addVote = await Complaint.findByIdAndUpdate(
        complaintId,
        { $push: { votes: userId } },
        { new: true }
      );
      if (!addVote) return { result: addVote, success: false };
      return { result: addVote, success: true };
    }
  } catch (error) {
    return { result: error, success: false };
  }
};

/**
 * Confirm when a complaint processing is done [User]
 * @async
 * @param {ObjectId} complaintId
 * @param {ObjectId} userId Complainer: owner
 * @returns {defaultReturnType}
 */
exports.confirmProgressDone = async (userId, complaintId) => {
  try {
    const result = await Complaint.findOneAndUpdate(
      { owner: userId, _id: complaintId },
      {
        $set: { status: "confirmed" },
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
 * Get a single complaint by its id [Admin|Authority|User]
 * @async
 * @param {ObjectId} complaintId
 * @returns {defaultReturnType}
 */
exports.getComplaintById = async (complaintId) => {
  try {
    const result = await Complaint.findById(complaintId)
      .populate({
        path: "owner",
        select: "firstName lastName profImg",
      })
      .populate({
        path: "comments.commentor",
        select: "firstName lastName profImg",
      })
      .populate("category");
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * Get all complaints by its user [User]
 * @async
 * @param {objectId} userId
 * @returns {defaultReturnType}
 */
exports.getComplaintsByOwner = async (userId) => {
  try {
    const result = await Complaint.find({ owner: userId })
      .populate({
        path: "owner",
        select: "firstName lastName profImg",
      })
      .populate({
        path: "comments.commentor",
        select: "firstName lastName profImg",
      })
      .populate("category");
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * Get all complaints by its category [Admin|Authority]
 * @async
 * @param {string} category
 * @returns {defaultReturnType}
 */
exports.getAllComplaintsByCategory = async (category) => {
  try {
    const result = await Complaint.find({ category })
      .populate({
        path: "owner",
        select: "firstName lastName profImg",
      })
      .populate({
        path: "comments.commentor",
        select: "firstName lastName profImg",
      })
      .populate("category");
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * Get all complaints by its city [User]
 * @async
 * @param {String} city
 * @returns {defaultReturnType}
 */
exports.getAllComplaintsByCity = async (userId) => {
  try {
    // const userRes = await User.findById(userId).select("location");

    // const city = userRes.location.city;
    // console.log("User City", city);

    const result = await Complaint.find({ "location.city": city })
      .populate({
        path: "owner",
        select: "firstName lastName profImg",
      })
      .populate({
        path: "comments.commentor",
        select: "firstName lastName profImg",
      });
    // .populate("category");
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * Get all complaints by its district [Authority]
 * @async
 * @param {String} district
 * @returns {defaultReturnType}
 */
exports.getAllComplaintsByDistrict = async (district) => {
  try {
    const result = await Complaint.find({ district })
      .populate({
        path: "owner",
        select: "firstName lastName profImg",
      })
      .populate({
        path: "comments.commentor",
        select: "firstName lastName profImg",
      })
      .populate("category");
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * Gett all complaints [Admin]
 * @async
 * @returns {defaultReturnType}
 */
exports.getAllComplaintsForAdmin = async () => {
  try {
    const result = await Complaint.find()
      .populate({
        path: "owner",
        select: "firstName lastName profImg",
      })
      .populate({
        path: "comments.commentor",
        select: "firstName lastName profImg",
      })
      .populate("category");
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * Get all complaints by status
 * @async
 * @param {String} complaintState
 * @returns {defaultReturnType}
 */
exports.getAllComplaintsByStatusForAdmin = async (complaintState) => {
  try {
    const result = await Complaint.find({ status: complaintState })
      .populate({
        path: "owner",
        select: "firstName lastName profImg",
      })
      .populate({
        path: "comments.commentor",
        select: "firstName lastName profImg",
      })
      .populate("category");
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * Get all complaints by status
 * @async
 * @param {ObjectId} authorityId
 * @param {String} complaintState
 * @returns {defaultReturnType}
 */
exports.getAllComplaintsByStatusForAuthority = async (
  authorityId,
  complaintState
) => {
  try {
    const result = await Complaint.find({
      authority: authorityId,
      status: complaintState,
    })
      .populate({
        path: "owner",
        select: "firstName lastName profImg",
      })
      .populate({
        path: "comments.commentor",
        select: "firstName lastName profImg",
      })
      .populate("category");
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * Delete a complaint [Admin|?=System]
 * @async
 * @param {ObjectId} complaintId
 * @returns {defaultReturnType}
 */
exports.deleteComplaint = async (complaintId) => {
  try {
    const result = await Complaint.findByIdAndDelete(complaintId);
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};
