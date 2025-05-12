import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/errorHandler.js";
import UserModel from "../src/user/models/user.schema.js";
export const auth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler(401, "login to access this route!"));
  }
  const decodedData = await jwt.verify(token, process.env.JWT_Secret);
  req.user = await UserModel.findById(decodedData.id);
  next();
};
export const authByUserRole = (role) => {
  return (req, res, next) => {
    if ("admin" === role) {
      next();
    } else {
      next(
        new ErrorHandler(
          403,
          `Role: ${req.user?.role || "Unknown"} is not allowed to access this resource`
        )
      );
    }
  }
}