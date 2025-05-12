import express from "express";
import {
  addNewProduct,
  deleteProduct,
  deleteReview,
  getAllProducts,
  getAllReviewsOfAProduct,
  getProductDetails,
  rateProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { auth, authByUserRole } from "../../../middlewares/auth.js";

const router = express.Router();
//GET Routes
router.route("/products").get(getAllProducts);//TESTED//fronend done
router.route("/details/:id").get(getProductDetails);//TESTED//fronend done
router.route("/reviews/:id").get(getAllReviewsOfAProduct);//TESTED//fronedend done
//POST Routes User
router.route("/rate/:id").put(auth, rateProduct);//TESTED

//DELETE Routes User
router.route("/review/delete").delete(auth, deleteReview);//TESTED

//THESE ARE THE ADMIN ONLY ROUTES
//POST Routes
router.route("/add").post(auth, authByUserRole("admin"), addNewProduct);//TESTED
router.route("/update/:id").put(auth, authByUserRole("admin"), updateProduct);//TESTED

//DELETE ROUTE
router
  .route("/delete/:id").delete(auth, authByUserRole("admin"), deleteProduct);//TESTED
export default router;
