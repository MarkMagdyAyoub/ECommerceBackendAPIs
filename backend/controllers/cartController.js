const Cart = require("../models/cardModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const JSendStatus = require("../utils/jSendStatus");

const createCart = async (req, res) => {
  try {
    const { user_id, item } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { error: "User not found" }
      });
    }

    const product = await Product.findById(item.product_id);
    if (!product) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { error: "Product not found" }
      });
    }

    const cart = new Cart({ user_id, item });
    const savedCart = await cart.save();

    res.status(201).json({ status: JSendStatus.SUCCESS, data: savedCart });
  } catch (err) {
    res.status(400).json({ status: JSendStatus.FAIL, data: { error: err.message } });
  }
};


const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate("user_id", "username email")
      .populate("item.product_id", "name price");
    res.json({ status: JSendStatus.SUCCESS, data: carts });
  } catch (err) {
    res.status(500).json({ status: JSendStatus.ERROR, message: err.message });
  }
};

const getAllCartsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const carts = await Cart.find({ user_id: userId })
      .populate("item.product_id", "name price");
    res.json({ status: JSendStatus.SUCCESS, data: carts });
  } catch (err) {
    res.status(500).json({ status: JSendStatus.ERROR, message: err.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findById(id)
      .populate("user_id", "username email")
      .populate("item.product_id", "name price");

    if (!cart) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { error: "Cart not found" },
      });
    }

    res.json({ status: JSendStatus.SUCCESS, data: cart });
  } catch (err) {
    res.status(500).json({ status: JSendStatus.ERROR, message: err.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    const updatedCart = await Cart.findByIdAndUpdate(
      id,
      { "item.quantity": quantity },  
      { new: true }
    )
      .populate("user_id", "username email")
      .populate("item.product_id", "name price");

    if (!updatedCart) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { error: "Cart not found" },
      });
    }

    res.json({ status: JSendStatus.SUCCESS, data: updatedCart });
  } catch (err) {
    res.status(400).json({ status: JSendStatus.FAIL, data: { error: err.message } });
  }
};

const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCart = await Cart.findByIdAndDelete(id);

    if (!deletedCart) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { error: "Cart not found" },
      });
    }

    res.json({ status: JSendStatus.SUCCESS, data: { message: "Cart deleted" } });
  } catch (err) {
    res.status(500).json({ status: JSendStatus.ERROR, message: err.message });
  }
};

module.exports = {
  createCart,
  getAllCarts,
  getAllCartsByUser,
  getCartById,
  updateCart,
  deleteCart,
};
