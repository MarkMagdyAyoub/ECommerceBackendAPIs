const CategorySchema = require('../models/categoryModel');
const JSendStatus = require('../utils/jSendStatus');
const mongoose = require('mongoose');

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = new CategorySchema({ name, description });
    await category.save();

    res.status(201).json({
      status: JSendStatus.SUCCESS,
      data: { category }
    });
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { message: "Category already exists" }
      });
    }

    res.status(500).json({
      status: JSendStatus.ERROR,
      message: "Internal Server Error"
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { message: "Invalid category ID" }
      });
    }

    const category = await CategorySchema.findById(id);
    if (!category) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { message: "Category not found" }
      });
    }

    res.status(200).json({
      status: JSendStatus.SUCCESS,
      data: { category }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: JSendStatus.ERROR,
      message: "Internal Server Error"
    });
  }
};

const getCategoryByName = async (req, res) => {
  try {
    const { name } = req.params;
    const category = await CategorySchema.findOne({ name: name.toLowerCase() });

    if (!category) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { message: "Category not found" }
      });
    }

    res.status(200).json({
      status: JSendStatus.SUCCESS,
      data: { category }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: JSendStatus.ERROR,
      message: "Internal Server Error"
    });
  }
};

const getCategoryPage = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const categories = await CategorySchema.find().skip(skip).limit(limit);

    res.status(200).json({
      status: JSendStatus.SUCCESS,
      data: { categories }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: JSendStatus.ERROR,
      message: "Internal Server Error"
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { message: "Invalid category ID" }
      });
    }

    const category = await CategorySchema.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { message: "Category not found" }
      });
    }

    res.status(200).json({
      status: JSendStatus.SUCCESS,
      data: { message: "Category deleted successfully" }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: JSendStatus.ERROR,
      message: "Internal Server Error"
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { message: "Invalid category ID" }
      });
    }

    const category = await CategorySchema.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { message: "Category not found" }
      });
    }

    res.status(200).json({
      status: JSendStatus.SUCCESS,
      data: { category }
    });
  } catch (err) {
    console.error(err);

    if (err.code === 11000) { 
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { message: "Category name already exists" }
      });
    }

    res.status(500).json({
      status: JSendStatus.ERROR,
      message: "Internal Server Error"
    });
  }
};

module.exports = {
  createCategory,
  getCategoryById,
  getCategoryPage,
  deleteCategory,
  updateCategory,
  getCategoryByName
};
