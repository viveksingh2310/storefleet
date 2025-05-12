import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from 'cors'
import productRoutes from "./src/product/routes/product.routes.js";
import {
  errorHandlerMiddleware,
  handleUncaughtError,
} from "./middlewares/errorHandlerMiddleware.js";
import userRoutes from "./src/user/routes/user.routes.js";
import cookieParser from "cookie-parser";
import orderRoutes from "./src/order/routes/order.routes.js";
dotenv.config({ path: './config/uat.env' });
const app = express();
app.use(cors({
  origin: 'https://storefleet-frontend.vercel.app/', // Allow your Vite React frontend
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
//ROUTES
app.use("/api/storefleet/product", productRoutes);
app.use("/api/storefleet/user", userRoutes);
app.use("/api/storefleet/order", orderRoutes);
app.get("/api/storefleet/clear-cookies", (req, res) => {
  // Iterate through all cookies and clear them
  Object.keys(req.cookies).forEach((cookieName) => {
    res.clearCookie(cookieName);
  });
  res.status(200).send("All cookies cleared.");
});
app.get("/api/storefleet/get-cookies", (req, res) => {
  const { token ,user} = req.cookies;
  if (!token) {
    return res.status(404).json({ success: false, message: "No token found in cookies." });
  }
  res.status(200).json({ success: true, token ,user});
});

app.use(errorHandlerMiddleware);
export default app;