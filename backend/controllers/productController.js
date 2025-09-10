const Product = require('../models/productModel');
const Category = require('../models/categoryModel'); 
const JSendStatus = require('../utils/jSendStatus');
const mongoose = require('mongoose');

const createProduct = async (req, res) => {
  try {
    const { category_id } = req.body;

    const categoryExists = await Category.findById(category_id);
    if (!categoryExists) {
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { error: "Category does not exist" }
      });
    }

    const product = new Product(req.body);
    const savedProduct = await product.save();

    res.status(201).json({
      status: JSendStatus.SUCCESS,
      data: savedProduct
    });
  } catch (err) {
    res.status(500).json({
      status: JSendStatus.ERROR,
      message: err.message
    });
  }
};

const getProductPage = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const query = search && search.trim() !== "" 
      ? { $text: { $search: search.trim() } }
      : {};

    const products = await Product.find(query)
      .populate("category_id", "name")
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 }); 

    const total = await Product.countDocuments(query);

    res.json({
      status: JSendStatus.SUCCESS,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: JSendStatus.ERROR,
      message: err.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { error: 'Invalid product ID' }
      });
    }

    const product = await Product.findById(id).populate('category_id', 'name');

    if (!product) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { error: 'Product not found' }
      });
    }

    res.json({
      status: JSendStatus.SUCCESS,
      data: product
    });
  } catch (err) {
    res.status(500).json({
      status: JSendStatus.ERROR,
      message: err.message
    });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { error: 'Invalid product ID' }
      });
    }

    if (category_id) {
      if (!mongoose.Types.ObjectId.isValid(category_id)) {
        return res.status(400).json({
          status: JSendStatus.FAIL,
          data: { error: 'Invalid category ID' }
        });
      }

      const categoryExists = await Category.findById(category_id);
      if (!categoryExists) {
        return res.status(400).json({
          status: JSendStatus.FAIL,
          data: { error: 'Category does not exist' }
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    }).populate('category_id', 'name'); 

    if (!updatedProduct) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { error: 'Product not found' }
      });
    }

    res.json({
      status: JSendStatus.SUCCESS,
      data: updatedProduct
    });
  } catch (err) {
    res.status(500).json({
      status: JSendStatus.ERROR,
      message: err.message
    });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { error: 'Invalid product ID' }
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { error: 'Product not found' }
      });
    }

    res.json({
      status: JSendStatus.SUCCESS,
      data: { message: 'Product deleted successfully' }
    });
  } catch (err) {
    res.status(500).json({
      status: JSendStatus.ERROR,
      message: err.message
    });
  }
};

module.exports = {
  createProduct,
  getProductPage,
  getProductById,
  updateProduct,
  deleteProductById
};
