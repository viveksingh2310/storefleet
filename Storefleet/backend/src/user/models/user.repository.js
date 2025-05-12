import UserModel from "./user.schema.js";
import mongoose from "mongoose";
import { ObjectId } from "mongoose";

export const createNewUserRepo = async (user) => {
  return await new UserModel(user).save();
};
 // Ensure no bcrypt hash involved

export const findUserRepo = async (factor, withPassword = false) => {
  if (withPassword) return await UserModel.findOne(factor).select("+password");
  else return await UserModel.findOne(factor);
};

export const findUserForPasswordResetRepo = async (hashtoken) => {
  return await UserModel.findOne(
    {
    resetPasswordToken: hashtoken
     },
  );
};

export const updateUserProfileRepo = async (_id, data) => {
  return await UserModel.findOneAndUpdate({_id}, data, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
};

export const getAllUsersRepo = async () => {
  return UserModel.find({});
};
export const checkUser = async(email)=>{
  const result= UserModel.find({email:email});
  if(result)
    return result;
  else return null;
}

export const deleteUserRepo = async (_id) => {
  return await UserModel.findByIdAndDelete(_id);
};

export const updateUserRoleAndProfileRepo = async (_id, data) => { //IMPLEMENTED
  const user=await UserModel.findById(_id);
  if(!user)
    return null;
  const updateFields = {};
  if (data.name !== undefined) updateFields.name = data.name;
  if (data.email !== undefined) updateFields.email = data.email;
  if (data.profileImg !== undefined) updateFields.profileImg = data.profileImg;
  updateFields.role = user.role === "admin" ? "user" : "admin";
  const updatedUser = await UserModel.findOneAndUpdate(
    { _id },
    { $set: updateFields },
    { new: true, runValidators: true }
  );
  return updatedUser;
};
