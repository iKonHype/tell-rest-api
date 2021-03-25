const User = require("../models/User");



//update profile
const updateProfile =async (payload) => {
try {
  const userId=payload.userId;
  payload.userId = undefined;
  
  const result = await User.findByIdAndUpdate(userId,{$set:payload},{new:true});

  if(!result)return{result,success:false};
  return{result,success:true};
} catch (error) {
  return {result:error.message,success:false}
}


};

//dispaly/read profile 
const readProfile = (payload)=>{
  
try {
  const userId = payload.userId;
  payload.userId = undefined;

  const result = await User.findOne(userId,{$set:payload},{new:true});

  if(!result)return{result,success:false};
  return{result,success:true};

} catch (error) {
  return{result:error.message,success:false}
}
  //const result=await User.
};

//delete profile

const deleteProfile=(userId)=>{
 
  try {
    const userId=await User.findByIdAndDelete(userId); 

   return {result:null,success:true}

  } catch (error) {
    return{result:error.message,success:false}
  }

};

module.exports = {
  updateProfile,
  readProfile,
  deleteProfile
};
