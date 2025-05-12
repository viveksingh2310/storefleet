// Please don't change the pre-written code
// Import the necessary modules here

import { createNewOrderRepo, findOrderByUserId} from "../model/order.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

export const createNewOrder = async (req, res, next) => {
  // Write your code here for placing a new order
  const data=req.body;
  if(!data.user || !data.paymentInfo || !data.paidAt || !data.itemsPrice || !data.taxPrice || !data.shippingPrice || !data.totalPrice){
    return res.json({
      "success":false,
      "msg":"strucrure the post request accurately or fill all the required detailed carefully"
    });
  }
  const result=await createNewOrderRepo(data);//data is transferred accurately
res.json({
  "success":true,
  "msg":"The data is created successfully in the database",
  "createdData":result,
})
};
export const getOrders= async (req,res,next)=>{
  const {user}=req.cookies;
  const userId=user._id;
  const result =await findOrderByUserId(userId);
 
  if(!result){
    return next(new ErrorHandler("No order found",404));
  }
   console.log('inside the get order controller');
  console.log(result);
  res.json({
    "success":true,
    "fetchedData":result
  });
}
