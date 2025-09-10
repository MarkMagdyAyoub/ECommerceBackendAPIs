const jwt = require('jsonwebtoken');
const JSendStatus = require('../utils/jSendStatus');
const Order = require('../models/orderModel');
require('dotenv').config();


const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({
        status: JSendStatus.FAIL,
        data: { message: "No token provided" }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    
    req.user = decoded; 
    next();

  } catch (err) {
    console.error(err);
    return res.status(401).json({
      status: JSendStatus.FAIL,
      data: { message: "Invalid or expired token" }
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      status: JSendStatus.FAIL,
      data: { message: "Access denied. Admin privileges required" }
    });
  }
  next();
};

const isUser = (req, res, next) => {
  if (req.user.role !== "USER") {
    return res.status(403).json({
      status: JSendStatus.FAIL,
      data: { message: "Access denied. User privileges required" }
    });
  }
  next();
};

const isUserIdInTokenEqualUserIdInParams = (req, res, next) => {
  const { userId } = req.params; // extract the userId from params

  if (!userId || userId !== req.user.id) {
    return res.status(403).json({
      status: "fail",
      data: { message: "Access denied. You can only access your own resources" }
    });
  }

  next();
};

const isAdminOrOwner = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { error: "Order not found" },
      });
    }

    if (req.user.role === "ADMIN") return next();

    if (req.user.role === "USER" && order.user_id.toString() === req.user.id) {
      return next();
    }

    return res.status(403).json({
      status: JSendStatus.FAIL,
      data: { error: "Access denied. You can only delete your own orders" },
    });
  } catch (err) {
    return res.status(500).json({
      status: JSendStatus.ERROR,
      message: err.message,
    });
  }
};

const isUserIdInTokenEqualUserIdInBody = (req, res, next) => {
    const bodyUserId = req.body.user_id; 
    if (!bodyUserId || bodyUserId !== req.user.id) {
        return res.status(403).json({
            status: "fail",
            data: { message: "Access denied. You can only create an order for yourself" }
        });
    }
    next();
};


module.exports = {
  isAuthenticated , 
  isAdmin , 
  isUser  , 
  isUserIdInTokenEqualUserIdInParams , 
  isUserIdInTokenEqualUserIdInBody,
  isAdminOrOwner
};