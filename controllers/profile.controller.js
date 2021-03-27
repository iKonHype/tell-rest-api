const ProfileService = require("../services/ProfileService");

//Profile update
const updateController = async (req, res) => {
  const {
    userId,
    firstName,
    lastName,
    email,
    gender,
    birthdate,
    profImg,
    contact,
    occupation,
    address,
    city,
    postal,
    district,
  } = req.body;

  try {
    const { result, success } = await ProfileService.updateProfile(
      userId,
      firstName,
      lastName,
      email,
      gender,
      birthdate,
      profImg,
      contact,
      occupation,
      address,
      city,
      postal,
      district
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Profile update failed",
      });
    }
    return res.status(201).json({
      result,
      success,
      msg: "Update success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error",
      err: error.message,
      success: false,
    });
  }
};
//Profile read
const readController = async (req, res) => {
  try {
    const { result, success } = await ProfileService.getProfilebyId(
      req.params.userId
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "getprofilebyId failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "profile read success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error on get readController",
      err: error.message,
      success: false,
    });
  }
};
//Profile delete
const deleteController = async (req, res) => {
  try {
    const { result, success } = await ProfileService.deleteProfilebyID(
      req.params.userId
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Profile deletion failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Delete success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @deleteProfilebyId",
      err: error.message,
      success: false,
    });
  }
};

const adminController = async (req, res) => {
  const {
    authorityName,
    username,
    email,
    password,
    contact,
    district,
  } = require.body;

  try {
    const { result, success } = await ProfileService.updateAdmin(
      authorityName,
      username,
      email,
      password,
      contact,
      district
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "auth update failed",
      });
    }
    return res.status(201).json({
      result,
      success,
      msg: "auth success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error",
      err: error.message,
      success: false,
    });
  }
};

const adminreadController = async (req, res) => {
  try {
    const { result, success } = await ProfileService.getProfilebyId(
      req.params.userId
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "admin get failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "admin read success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error on get readController",
      err: error.message,
      success: false,
    });
  }
}; //Profile delete
const deleteController = async (req, res) => {
  try {
    const { result, success } = await ProfileService.deleteProfilebyID(
      req.params.userId
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Profile deletion failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Delete success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @deleteProfilebyId",
      err: error.message,
      success: false,
    });
  }
};

//Profile delete
const admindeleteController = async (req, res) => {
  try {
    const { result, success } = await ProfileService.deleteProfilebyID(
      req.params.userId
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Profile deletion failed",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "Delete success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error @deleteProfilebyId",
      err: error.message,
      success: false,
    });
  }
};

module.exports = {
  updateController,
  readController,
  deleteController,
  adminController,
  adminreadController,
  admindeleteController,
};
