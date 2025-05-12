// Please don't change the pre-written code
// Import the necessary modules here

import express from "express";
import {
  createNewUser,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getUserDetails,
  getUserByEmail,
  getUserDetailsForAdmin,
  logoutUser,
  resetUserPassword,
  updatePassword,
  updateUserProfile,
  updateUserProfileAndRole,
  userLogin,
} from "../controller/user.controller.js";
import { auth, authByUserRole } from "../../../middlewares/auth.js";

const router = express.Router();
// User POST Routes
router.route("/signup").post(createNewUser);//TESTED
router.route("/login").post(userLogin);//TESTED
router.route("/password/forget").post(forgetPassword);//sending the email//TESTED

// User PUT Routes
router.route("/password/reset/:token").put(resetUserPassword);//TESTED
router.route("/password/update").put(auth, updatePassword);//TESTED//fr done
router.route("/profile/update").put(auth, updateUserProfile);//TESTED//fr done

// User GET Routes
router.route("/profile").get(auth,getUserByEmail);//TESTED//fr done
router.route("/details").get(auth, getUserDetails);//TESTED
router.route("/logout").get(auth, logoutUser);//TESTED

// Admin GET Routes
router.route("/admin/allusers").get(auth, authByUserRole("admin"), getAllUsers);//TESTED//fr done
router.route("/admin/details/:id").get(auth, authByUserRole("admin"), getUserDetailsForAdmin);//TESTED// fr done

// Admin DELETE Routes
router
  .route("/admin/delete/:id")
  .delete(auth, authByUserRole("admin"), deleteUser);//TESTED
router.route("/admin/update/:id").put(auth,authByUserRole("admin"),updateUserProfileAndRole);//DONE BUT NOT IMPLEMENTED//TESTED

export default router;
