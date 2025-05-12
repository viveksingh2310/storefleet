import OrderModel from "./order.schema.js";
import mongoose from "mongoose";

export const createNewOrderRepo = async (data) => {
  const newOrder=new OrderModel(data);
  return await newOrder.save();
};
export const findOrderByUserId=async (userId)=> {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);
    const orders = await OrderModel.find({ user: objectId });
    return orders;
  } catch (error) {
    console.error('Error finding orders by userId:', error);
    throw error;
  }
}
