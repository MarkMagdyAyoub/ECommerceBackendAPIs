const Cart = require('../models/cardModel');
const Order = require('../models/orderModel');
const isCartOwner = async (req, res, next) => {
  try {
    const { id } = req.params; // cartId
    const userId = req.user.id; // from JWT

    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({
        status: "fail",
        data: { message: "Cart not found" },
      });
    }

    if (cart.user_id.toString() !== userId) {
      return res.status(403).json({
        status: "fail",
        data: { message: "Access denied. You can only update your own cart" },
      });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};


const isOrderOwner = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { error: "Order not found" },
      });
    }

    if (req.user.role === "USER" && order.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        status: JSendStatus.FAIL,
        data: { error: "Access denied. You can only modify your own orders." },
      });
    }

    req.order = order; 
    next();
  } catch (err) {
    return res.status(500).json({
      status: JSendStatus.ERROR,
      message: err.message,
    });
  }
};


const isAdminOrUserOwner = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (req.user.role === "ADMIN") return next();

    if (req.user.role === "USER" && userId === req.user.id) {
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

module.exports = {
  isCartOwner,
  isOrderOwner,
  isAdminOrUserOwner
};