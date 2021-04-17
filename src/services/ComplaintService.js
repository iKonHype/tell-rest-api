/**
 * @module service/complaint
 * @requires module:model/complaint
 */

const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Authority = require("../models/Authority");
const Category = require("../models/Category");

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
 * @param {string} complaintState ['open'|'accepted'|'rejected'|'processing'|'closed']
 * @returns {defaultReturnType}
 */
exports.updateComplaintStatus = async (
  userId,
  complaintId,
  complaintState,
  reason
) => {
  reason = reason ?? "Reason is not defined";
  console.log("Body got", { userId, complaintId, complaintState, reason });
  try {
    if (complaintState === "closed") {
      console.log("Sending confirmation email and sms");
      const result = await Complaint.findById(complaintId)
        .select("owner title")
        .populate({
          path: "owner",
          select: "email contact firstName",
        });
      //TODO: send email throuh communication service
      //TODO: send SMS through communication service
      return { result, success: true };
    }

    const result = await Complaint.findByIdAndUpdate(
      complaintId,
      {
        $set: { status: complaintState },
      },
      { new: true }
    ).populate({ path: "owner", select: "email contact firstName" });

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
        $set: { status: "closed" },
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
exports.getAllComplaintsByFilter = async (query) => {
  const { stat, cat, auth, date } = query;
  console.log("Query", query);
  let result = [];

  try {
    let filter =
      cat === "all" && auth === "all"
        ? {
            status: stat,
            createdAt: { $gte: date },
          }
        : cat !== "all" && auth === "all"
        ? {
            status: stat,
            createdAt: { $gte: date },
            category: cat,
          }
        : cat === "all" && auth !== "all"
        ? {
            status: stat,
            createdAt: { $gte: date },
            authority: auth,
          }
        : {
            status: stat,
            createdAt: { $gte: date },
            category: cat,
            authority: auth,
          };

    result = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "owner",
        select: "firstName lastName profImg",
      })
      .populate({
        path: "comments.commentor",
        select: "firstName lastName profImg",
      })
      .populate("category")
      .populate({
        path: "authority",
        select: "authorityName",
      });

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

exports.getCategoriesAndAuthorities = async () => {
  try {
    const categories = await Category.find().select("title").sort({ title: 1 });
    const authorities = await Authority.find({ role: 49 })
      .select("authorityName")
      .sort({ authorityName: 1 });

    console.log("result bambam", { categories, authorities });
    if (!(authorities && categories))
      return {
        result: { categories: null, authorities: null },
        success: false,
      };
    return { result: { categories, authorities }, success: true };
  } catch (error) {
    console.log("Erro while loading cat auth", error);
    return { result: error.message, success: false };
  }
};

exports.getReport = async () => {
  try {
    const totalCases = await Complaint.countDocuments();
    const pendingCases = await Complaint.countDocuments({
      status: { $in: ["open", "accepted", "processing"] },
    });
    const solvedCases = await Complaint.countDocuments({
      status: "closed",
    });

    console.log("result bambam", { totalCases, pendingCases, solvedCases });
    return { result: { totalCases, pendingCases, solvedCases }, success: true };
  } catch (error) {
    console.log("Erro while loading cat auth", error);
    return { result: error.message, success: false };
  }
};
