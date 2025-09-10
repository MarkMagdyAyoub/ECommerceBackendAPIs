const Order = require("../models/orderModel");
const Product = require('../models/productModel');
const mongoose = require('mongoose');
const JSendStatus = require("../utils/jSendStatus");

const createOrder = async (req, res) => {
  try {
    const { items, shipping_address } = req.body;

    let total_price = 0;

    for (const item of items) {
      const product = await Product.findById(item.product_id); 
      if (!product) throw new Error(`Product not found: ${item.product_id}`);

      const quantity = Number(item.quantity);

      if (product.stock < quantity) {
        throw new Error(`Not enough stock for ${product.name}`);
      }

      item.price_at_purchase = product.price;
      product.stock -= quantity;
      await product.save();

      total_price += quantity * product.price;
    }

    const order = new Order({
      user_id: req.user.id,
      items,
      shipping_address,
      total_price,
      payment_status: "pending",
      is_deleted: false
    });

    await order.save();

    return res.status(201).json({
      status: JSendStatus.SUCCESS,
      data: order
    });
  } catch (err) {
    console.error("Order creation failed:", err);
    return res.status(400).json({
      status: JSendStatus.FAIL,
      data: { error: "Failed to create order. " + err.message }
    });
  }
};


const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOneAndUpdate(
      { _id: id, is_deleted: false },
      { is_deleted: true },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { message: "Order not found or already deleted" }
      });
    }

    res.json({
      status: JSendStatus.SUCCESS,
      data: { message: "Order deleted successfully (soft delete)" }
    });
  } catch (err) {
    res.status(500).json({
      status: JSendStatus.ERROR,
      message: err.message
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, is_deleted: false })
      .populate("items.product_id", "name price");

    if (!order) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { message: "Order not found or deleted" }
      });
    }

    res.json({
      status: JSendStatus.SUCCESS,
      data: order
    });
  } catch (err) {
    res.status(500).json({
      status: JSendStatus.ERROR,
      message: err.message
    });
  }
};



// Get all orders by user
const getOrderByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user_id: userId, is_deleted: false })
      .populate("items.product_id", "name price");

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { message: "No orders found for this user" }
      });
    }

    res.json({
      status: JSendStatus.SUCCESS,
      data: orders
    });
  } catch (err) {
    res.status(500).json({
      status: JSendStatus.ERROR,
      message: err.message
    });
  }
};

const getOrderByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await Order.find({ user_id: id, is_deleted: false })
      .populate("items.product_id", "name price");

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { message: "No orders found for this user" }
      });
    }

    res.json({
      status: JSendStatus.SUCCESS,
      data: orders
    });
  } catch (err) {
    res.status(500).json({
      status: JSendStatus.ERROR,
      message: err.message
    });
  }
};


// Get all orders by product ID
const getOrderByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const orders = await Order.find({ 
      "items.product_id": productId,
      is_deleted: false
    }).populate("items.product_id", "name price");

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { message: "No orders found containing this product" }
      });
    }

    res.json({
      status: JSendStatus.SUCCESS,
      data: orders
    });
  } catch (err) {
    res.status(500).json({
      status: JSendStatus.ERROR,
      message: err.message
    });
  }
};

// Get all orders by status
const getStatusPage = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Ensure status exists and is valid
    const validStatuses = ['pending', 'paid', 'failed', 'cancelled', 'refunded'];
    if (!status) {
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { message: "Status query parameter is required" }
      });
    }
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { message: `Invalid status. Valid statuses: ${validStatuses.join(", ")}` }
      });
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const orders = await Order.find({ payment_status: status, is_deleted: false })
      .populate("items.product_id", "name price")
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalOrders = await Order.countDocuments({ payment_status: status, is_deleted: false });
    const totalPages = Math.ceil(totalOrders / pageSize);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { message: `No orders found with status '${status}'` }
      });
    }

    res.json({
      status: JSendStatus.SUCCESS,
      data: {
        orders,
        pagination: {
          totalOrders,
          totalPages,
          currentPage: pageNumber,
          pageSize
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      status: JSendStatus.ERROR,
      message: err.message
    });
  }
};


// Get orders within time range
const getOrdersWithinTimeRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const orders = await Order.find({
      created_at: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });

    res.json({
      status: JSendStatus.SUCCESS,
      data: orders
    });
  } catch (err) {
    res.status(500).json({
      status: JSendStatus.ERROR,
      message: err.message
    });
  }
};

const updateOrderFromUser = async (req, res) => {
  try {
    const { shipping_address } = req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false }, 
      { shipping_address },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { message: "Order not found or deleted" }
      });
    }

    res.json({
      status: JSendStatus.SUCCESS,
      data: updatedOrder,
    });
  } catch (err) {
    res.status(400).json({
      status: JSendStatus.FAIL,
      data: { error: err.message },
    });
  }
};

const updateOrderFromAdmin = async (req, res) => {
  try {
    const { shipping_address, total_price, payment_status } = req.body;

    const updateData = {};
    if (shipping_address) updateData.shipping_address = shipping_address;
    if (total_price !== undefined) updateData.total_price = total_price;
    if (payment_status) updateData.payment_status = payment_status;

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false }, // <-- ensure not deleted
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { message: "Order not found or deleted" }
      });
    }

    res.json({
      status: JSendStatus.SUCCESS,
      data: updatedOrder,
    });
  } catch (err) {
    res.status(400).json({
      status: JSendStatus.FAIL,
      data: { error: err.message },
    });
  }
};

module.exports = {
  createOrder,
  deleteOrder,
  updateOrderFromUser,
  updateOrderFromAdmin,
  getOrderById,
  getOrderByUser,
  getOrderByUserId,
  getOrderByProduct,
  getStatusPage,
  getOrdersWithinTimeRange,
};
