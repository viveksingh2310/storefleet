import { sendPasswordResetEmail } from "../../../utils/emails/passwordReset.js";
import { sendWelcomeEmail } from "../../../utils/emails/welcomeMail.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";
import { sendToken } from "../../../utils/sendToken.js";
import {
  createNewUserRepo,
  deleteUserRepo,
  checkUser,
  findUserForPasswordResetRepo,
  findUserRepo,
  getAllUsersRepo,
  updateUserProfileRepo,
  updateUserRoleAndProfileRepo,
} from "../models/user.repository.js";
import crypto from "crypto";
export const createNewUser = async (req, res, next) => {// done and handles successfully
  const { name, email, password } = req.body;
  try {
    const newUser = await createNewUserRepo(req.body);
    await sendToken(newUser, res, 200);
    const result=await checkUser(email);
    if(result)
      throw new Error("User Already Exist");
    await sendWelcomeEmail(newUser);
  } catch (err) {
    return next(new ErrorHandler(400, err));
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler(400, "please enter email/password"));
    }
    const user = await findUserRepo({ email:email }, true);
    if (!user) {
      return next(
        new ErrorHandler(401, "user not found! register yourself now!!")
      );
    }
    console.log('comparing the password of the user in the user.controller>userLogin function');
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return next(new ErrorHandler(401, "Invalid email or passswor!"));
    }
    await sendToken(user, res, 200);
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const logoutUser = async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({ success: true, msg: "logout successful" });
};

export const forgetPassword = async (req, res, next) => { //DONE
  const {email}=req.body;
  const user=await checkUser(email);
  if(!user) 
    throw new Error('user does not exist');
   const resetToken = crypto.randomBytes(20).toString("hex");
    const resetstring=crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    const resetexpirestring=Date.now() + 10 * 60 * 1000;
    console.log('the token of the required resettign of the email is as follows:',resetstring);
   user.resetPasswordToken = resetstring;
   user.resetPasswordExpire = resetexpirestring;
   await updateUserProfileRepo(user[0]._id,
    {
      $set:{
        resetPasswordToken: resetstring,
        resetPasswordExpire:resetexpirestring ,
      }
    });
  const url=`http://localhost:${process.env.PORT}`+`/api/storefleet/user/password/reset/`+resetstring;
  return await sendPasswordResetEmail(user,url);
};

export const resetUserPassword = async (req, res, next) => {//DONE
  console.log('the token and the new password for the user are as follows: ');
  const {token} =req.params;
  const {newPassword}=req.body;
  const resetUser=await findUserForPasswordResetRepo(token);
  const updatedUser= await updateUserProfileRepo(resetUser._id,
    { $set:{
      password:newPassword,
    }
  }
  );
  console.log('The password has been successfully reset.');
  console.log(updatedUser);
  next();
};

export const getUserDetails = async (req, res, next) => {
  try {
    const userDetails = await findUserRepo({ _id: req.user._id });
    res.status(200).json({ success: true, userDetails });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
export const getUserByEmail = async (req, res, next) => {////////////////////////////////////////////////////////
  try {
    console.log("User email:", req.user.email);
    const userDetails = await findUserRepo({ email: req.user.email });
    res.status(200).json({ success: true, userDetails });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
}


export const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  try {
    if (!currentPassword) {
      return next(new ErrorHandler(401, "pls enter current password"));
    }
    const user = await findUserRepo({ _id: req.user._id }, true);
    const passwordMatch = await user.comparePassword(currentPassword);
    if (!passwordMatch) {
      return next(new ErrorHandler(401, "Incorrect current password!"));
    }
    if (!newPassword || newPassword !== confirmPassword) {
      return next(
        new ErrorHandler(401, "mismatch new password and confirm password!")
      );
    }
    user.password = newPassword;
    await user.save();
    await sendToken(user, res, 200);
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const updateUserProfile = async (req, res, next) => {
  const { name, email,url} = req.body;
  try {
    const updatedUserDetails = await updateUserProfileRepo(req.user._id, {
      name,
      email,
      url
    });
    res.status(201).json({ success: true, updatedUserDetails });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

// admin controllers
export const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await getAllUsersRepo();
    res.status(200).json({ success: true, allUsers });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const getUserDetailsForAdmin = async (req, res, next) => {
  try {
    const userDetails = await findUserRepo({ _id: req.params.id });
    if (!userDetails) {
      return res
        .status(400)
        .json({ success: false, msg: "no user found with provided id" });
    }
    res.status(200).json({ success: true, userDetails });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await deleteUserRepo(req.params.id);
    if (!deletedUser) {
      return res
        .status(400)
        .json({ success: false, msg: "no user found with provided id" });
    }

    res
      .status(200)
      .json({ success: true, msg: "user deleted successfully", deletedUser });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const updateUserProfileAndRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedResult = await updateUserRoleAndProfileRepo(id, data);
    if (!updatedResult) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }
    return res.status(200).json({ success: true, user: updatedResult });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};