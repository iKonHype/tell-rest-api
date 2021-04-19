/**
 * @module controller/coomplaint
 * @requires module:service/complaint
 */

const complaintService = require("../services/ComplaintService");

/**
 * Create a new complaint by the user
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.createNewComplaintController = async (req, res) => {
  const {
    userId,
    title,
    content,
    category,
    authority,
    location,
    landmark,
    media,
  } = req.body;
  try {
    const { result, success } = await complaintService.createNewComplaint(
      userId,
      title,
      content,
      category,
      authority,
      location,
      landmark,
      media
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Create new complaint failed",
      });
    }

    return res.status(201).json({
      result,
      success,
      msg: "Create new user success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @createNewComplaintController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Update complaint sttatus
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.updateComplaintStatusController = async (req, res) => {
  const { userId, complaintId, complaintState, reason } = req.body;
  try {
    const { result, success } = await complaintService.updateComplaintStatus(
      userId,
      complaintId,
      complaintState,
      reason
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Update complaint status failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Update complaint status success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @updateComplaintStatusController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * User comment on a complaint
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.commentOnComplaintController = async (req, res) => {
  const { userId, complaintId, content } = req.body;
  try {
    const { result, success } = await complaintService.commentOnComplaint(
      userId,
      complaintId,
      content
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Comment on complaint failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Comment on complaint success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @commentOnComplaintController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * User upvote a complaint
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.upvoteComplaintController = async (req, res) => {
  const { userId, complaintId } = req.body;
  try {
    const { result, success } = await complaintService.upvoteComplaint(
      userId,
      complaintId
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Upvote complaint failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Upvote complaint success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @upVoteComplaintController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Complaint owner confirm the process is done
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.confirmProgressDoneController = async (req, res) => {
  const { userId, complaintId } = req.params;
  try {
    const { result, success } = await complaintService.confirmProgressDone(
      userId,
      complaintId
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Comfirm progress as done failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Comfirm progress as done success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @confirmProgressDoneController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Get a complaint by its id
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.getComplaintByIdController = async (req, res) => {
  try {
    const { result, success } = await complaintService.getComplaintById(
      req.params.complaintId
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Get complaint by id failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Get complaint by id success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getComplaintByIdController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Get all complaints by its owner
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.getComplaintsByOwnerController = async (req, res) => {
  try {
    const { result, success } = await complaintService.getComplaintsByOwner(
      req.params.userId
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Get complaints by owner failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Get complaints by owner success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getComplaintsByOwnerController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Get all complaints by category
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.getComplaintsByCategoryController = async (req, res) => {
  try {
    const {
      result,
      success,
    } = await complaintService.getAllComplaintsByCategory(
      req.params.categoryId
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Get complaints by category failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Get complaints by category success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getComplaintsByCategoryController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Get all complaints by city
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.getAllComplaintsByCityController = async (req, res) => {
  try {
    const { result, success } = await complaintService.getAllComplaintsByCity(
      req.params.userId
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Get complaints by city failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Get complaints by city success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getAllComplaintsByCity",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Get all complaints by district
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.getAllComplaintsByDistrictController = async (req, res) => {
  try {
    const {
      result,
      success,
    } = await complaintService.getAllComplaintsByDistrict(req.query.q);
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Get complaints by district failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Get complaints by district success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getAllComplaintsByDistrictController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Get all complaints
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.getAllComplaintsForAdminController = async (req, res) => {
  try {
    const {
      result,
      success,
    } = await complaintService.getAllComplaintsForAdmin();
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Get complaints for admin failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Get complaints for admin success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getAllComplaintsForAdminController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Get all complaits for admin status
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.getAllComplaintsByFilterController = async (req, res) => {
  try {
    const { result, success } = await complaintService.getAllComplaintsByFilter(
      req.query
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Get complaints by status failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Get complaints by status success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getAllComplaintsByStatusForAdminController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Get all complaints for authority by status
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.getAllComplaintsByStatusForAuthorityController = async (req, res) => {
  try {
    const {
      result,
      success,
    } = await complaintService.getAllComplaintsByStatusForAuthority(
      req.params.authorityId,
      req.query.state
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Get complaints by status failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Get complaints by status success",
    });
  } catch (error) {
    return res.status(500).json({
      msg:
        "Internal server error @getAllComplaintsByStatusForAuthorityController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Delete a complaint
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.deleteComplaitByIdController = async (req, res) => {
  try {
    const { result, success } = await complaintService.deleteComplaint(
      req.params.complaintId
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Delete complaint failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Delete complaint success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @deleteComplaitByIdController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Get categories and authorities
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.getCategoriesAndAuthoritiesController = async (req, res) => {
  try {
    const {
      result,
      success,
    } = await complaintService.getCategoriesAndAuthorities();
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Fetching categories and authorities failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Fetching categories and authorities success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getCategoriesAndAuthoritiesController",
      err: error.message,
      success: false,
    });
  }
};

/**
 * Get report
 * @async
 * @param {HTTP} req
 * @param {HTTP} res
 * @returns {Response}
 */
exports.getReportController = async (req, res) => {
  try {
    const { result, success } = await complaintService.getReport();
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Fetching report failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Fetching report success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @getReportController",
      err: error.message,
      success: false,
    });
  }
};
