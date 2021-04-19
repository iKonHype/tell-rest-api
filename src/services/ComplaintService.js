/**
 * @module service/complaint
 * @requires module:model/complaint
 */

const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Authority = require("../models/Authority");
const Category = require("../models/Category");
const got = require("got");

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
  category,
  authority,
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
      category,
      authority,
    });

    const result = await complaint.save();
    if (!result) return { result: null, success: false };

    const saveComplaintsInUser = await User.findByIdAndUpdate(
      userId,
      { $push: { complaints: result._id } },
      { new: true }
    ).select("email firstName");
    if (!saveComplaintsInUser) return { result: null, success: false };

    const { body } = await got.post(
      "https://us-central1-sewa-5df00.cloudfunctions.net/app/email/send",
      {
        json: {
          userEmail: saveComplaintsInUser.email,
          emailSubject: "TELL | New Complaint Placement Notification",
          emailBody: `<h1>Hello ${saveComplaintsInUser.firstName}!</h1><h2>We have recorded your complaint and will take neccessary actions as soon as possible</h2><h3>Complaint Title: ${result.title}<br/>Complaint Id: tell-${result._id}</h3><h3>Thank you.</h3><h4>Best Regards<br/>Customer Support Team<br/>Tell Inc</h4>`,
        },
        responseType: "json",
      }
    );
    console.log("email body", body);

    if (!body.data.success)
      return { result, success: true, info: "email not sent" };

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
  try {
    if (complaintState === "closed") {
      const result = await Complaint.findById(complaintId)
        .select("owner title")
        .populate({
          path: "owner",
          select: "email contact firstName",
        });
      if (!result) return { result: null, success: false };

      const { body } = await got.post(
        "https://us-central1-sewa-5df00.cloudfunctions.net/app/email/complete",
        {
          json: {
            userEmail: result.owner.email,
            userFirstName: result.owner.firstName,
            complaintID: result._id,
            complaintTitle: result.title,
            link: `https://tell-lk.netlify.app/.netlify/functions/api/complaints/confirm/${result.owner._id}/${result._id}`,
          },
          responseType: "json",
        }
      );
      console.log("email body", body);

      if (!body.data.success)
        return { result, success: true, info: "email not sent" };

      return { result, success: true };
    }

    const result = await Complaint.findByIdAndUpdate(
      complaintId,
      {
        $set: { status: complaintState },
      },
      { new: true }
    )
      .populate({ path: "owner", select: "email contact firstName" })
      .populate({ path: "authority", select: "authorityName" });
    if (!result) return { result, success: false };

    const { body } = await got.post(
      "https://us-central1-sewa-5df00.cloudfunctions.net/app/email/send",
      {
        json: {
          userEmail: result.owner.email,
          emailSubject: "TELL | Complaint Status Change Notification",
          emailBody: `<h1>Hello ${result.owner.firstName}!</h1><h2>${
            result.authority.authorityName
          } has mark your complaint as ${result.status.toUpperCase()} ${
            result.status === "rejected"
              ? `mentioning the reason as "${result.reason}"`
              : ""
          }.</h2><h3>Complaint Id: tell-${result._id}<br/>Complaint Title: ${
            result.title
          }</h3><h3>Thank you.</h3><h4>Best Regards<br/>Customer Support Team<br/>Tell Inc</h4>`,
        },
        responseType: "json",
      }
    );
    console.log("email body", body);

    if (!body.data.success)
      return { result, success: true, info: "email not sent" };

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
        select: "firstName lastName contact",
      })
      .populate({
        path: "comments.commentor",
        select: "firstName lastName",
      })
      .populate("category")
      .populate({ path: "authority", select: "authorityName" });
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
      .sort({ updatedAt: -1 })
      .populate({
        path: "owner",
        select: "firstName lastName",
      })
      .populate({
        path: "comments.commentor",
        select: "firstName lastName",
      })
      .populate("category")
      .populate({ path: "authority", select: "authorityName" });
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
        select: "firstName lastName ",
      })
      .populate({
        path: "comments.commentor",
        select: "firstName lastName",
      })
      .populate("category")
      .populate({ path: "authority", select: "authorityName" });
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * Get all complaints by its city [User]
 * @async
 * @param {String} userId
 * @returns {defaultReturnType}
 */
exports.getAllComplaintsByCity = async (userId) => {
  try {
    const userRes = await User.findById(userId).select("address");

    const city = userRes.address.city.toLowerCase();

    const result = await Complaint.find({ "location.city": city })
      .sort({ createdAt: -1 })
      .populate({
        path: "owner",
        select: "firstName lastName ",
      })
      .populate({
        path: "comments.commentor",
        select: "firstName lastName",
      })
      .populate("category")
      .populate({ path: "authority", select: "authorityName" });
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
        select: "firstName lastName",
      })
      .populate({
        path: "comments.commentor",
        select: "firstName lastName",
      })
      .populate("category")
      .populate({ path: "authority", select: "authorityName" });
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
        select: "firstName lastName contact",
      })
      .populate({
        path: "comments.commentor",
        select: "firstName lastName",
      })
      .populate("category")
      .populate({ path: "authority", select: "authorityName" });
    if (!result) return { result, success: false };
    return { result, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * Get all complaints by status
 * @async
 * @param {object} query
 * @returns {defaultReturnType}
 */
exports.getAllComplaintsByFilter = async (query) => {
  const { stat, cat, auth, date } = query;
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
        select: "firstName lastName contact",
      })
      .populate({
        path: "comments.commentor",
        select: "firstName lastName",
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
        select: "firstName lastName contact",
      })
      .populate({
        path: "comments.commentor",
        select: "firstName lastName",
      })
      .populate("category")
      .populate({ path: "authority", select: "authorityName" });
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

/**
 * Get all categories and authorities [Admin|Authority]
 * @async
 * @returns {defaultReturnType}
 */
exports.getCategoriesAndAuthorities = async () => {
  try {
    const categories = await Category.find().select("title").sort({ title: 1 });
    const authorities = await Authority.find({ role: 49 })
      .select("authorityName")
      .sort({ authorityName: 1 });

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

/**
 * Get all report [*]
 * @async
 * @returns {defaultReturnType}
 */
exports.getReport = async () => {
  try {
    const totalCases = await Complaint.countDocuments();
    const pendingCases = await Complaint.countDocuments({
      status: { $in: ["open", "accepted", "processing"] },
    });
    const solvedCases = await Complaint.countDocuments({
      status: "closed",
    });

    return { result: { totalCases, pendingCases, solvedCases }, success: true };
  } catch (error) {
    console.log("Error while loading cat auth", error);
    return { result: error.message, success: false };
  }
};
