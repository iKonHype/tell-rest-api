const {
   updateProfile,
   readProfile,
   deleteProfile,
  } = require("../services/ProfileService");

 
  
//Profile update
  const updateController=(req,res)=>{
    const { userId,firstName,lastName,email,gender,birthdate,profImg,contact,occupation,address,city,postal,district} = req.body;

    try {
      const { result, success } = await updateProfile(
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
const readController=async (req,res)=>{
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
const deleteController=async (req,res)=>{
 
  try {
    const {result,success}= await ProfileService.deleteProfilebyID(req.params.userId);
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

module.exports={
  updateController,
  readController,
  deleteController
};