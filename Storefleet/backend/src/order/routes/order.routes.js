import express from "express";
import { createNewOrder,getOrders} from "../controllers/order.controller.js";
import { auth } from "../../../middlewares/auth.js";
const router = express.Router();
router.route("/new").post(auth, createNewOrder);//TESTED
router.route("/").get(auth,getOrders);
export default router;