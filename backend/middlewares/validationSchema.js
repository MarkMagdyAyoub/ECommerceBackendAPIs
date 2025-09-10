const { query , body , param , validationResult } = require('express-validator');
const JSendStatus = require('../utils/jSendStatus');
const Cart = require('../models/cardModel');

const pageValidation = () => {
  return [
    query('limit')
      .optional() 
      .isInt({ min: 1 }).withMessage('limit must be a positive integer')
      .toInt(),
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('page must be a positive integer')
      .toInt()
  ];
};

const registrationValidation = () => {
  return [
    body('username')
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 20 }).withMessage('Username must be 3–20 characters long')
      .trim(),

    body('email')
      .notEmpty().withMessage('Email is required'),

    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    body('role')
      .optional()
      .isIn(['ADMIN', 'USER']).withMessage('Role must be ADMIN or USER'),

    body('address.city')
      .notEmpty().withMessage('City is required'),

    body('address.street')
      .notEmpty().withMessage('Street is required'),

    body('phone')
      .notEmpty().withMessage('Phone number is required')
      .isMobilePhone().withMessage('Invalid phone number'),

    body('is_confirmed')
      .optional()
      .isBoolean().withMessage('is_confirmed must be a boolean')
      .toBoolean()
  ];
};

const loginValidation = () => {
  return [
    body('email')
      .notEmpty().withMessage('Email is required'),

    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ];
};

const updateValidation = () => {
  return [
    body('address.city')
      .optional()
      .notEmpty().withMessage('City cannot be empty'),

    body('address.street')
      .optional()
      .notEmpty().withMessage('Street cannot be empty'),

    body('phone')
      .optional()
      .notEmpty().withMessage('Phone number cannot be empty')
      .isMobilePhone().withMessage('Invalid phone number')
  ];
};

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: JSendStatus.FAIL,
      data: { errors: errors.array() }
    });
  }

  next(); 
};

const searchEmailValidation = () => {
  return [
    param('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Must be a valid email address')
      .normalizeEmail() 
  ];
};

const categoryCreateValidation = () => {
  return [
    body('name')
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 })
      .trim()
      .toLowerCase(),

    body('description') 
      .notEmpty().withMessage('Description is required')
      .isLength({ min: 5, max: 200 })
      .trim()
  ];
};

const categoryUpdateValidation = () => {
  return [
    body('name')
      .optional()
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
      .trim()
      .toLowerCase(),

    body('description')
      .optional()
      .isLength({ min: 5, max: 200 }).withMessage('Description must be between 5 and 200 characters')
      .trim()
  ];
};

const productCreateValidation = () => {
  return [
    body('name')
      .notEmpty().withMessage('Product name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters long')
      .trim(),

    body('category_id')
      .notEmpty().withMessage('Category is required')
      .isMongoId().withMessage('Category must be a valid MongoDB ObjectId'),

    body('brand')
      .optional()
      .isLength({ min: 2, max: 50 }).withMessage('Brand must be 2–50 characters long')
      .trim(),

    body('description')
      .optional()
      .isLength({ min: 5, max: 500 }).withMessage('Description must be 5–500 characters long')
      .trim(),

    body('stock')
      .notEmpty().withMessage('Stock is required')
      .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

    body('price')
      .notEmpty().withMessage('Price is required')
      .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),

    body('images')
      .optional()
      .isArray().withMessage('Images must be an array of strings'),

    body('images.*')
      .optional()
      .isString().withMessage('Each image must be a string (URL)')
  ];
};

const productUpdateValidation = () => {
  return [
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters long')
      .trim(),

    body('category_id')
      .optional()
      .isMongoId().withMessage('Category must be a valid MongoDB ObjectId'),

    body('brand')
      .optional()
      .isLength({ min: 2, max: 50 }).withMessage('Brand must be 2–50 characters long')
      .trim(),

    body('description')
      .optional()
      .isLength({ min: 5, max: 500 }).withMessage('Description must be 5–500 characters long')
      .trim(),

    body('stock')
      .optional()
      .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

    body('price')
      .optional()
      .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),

    body('images')
      .optional()
      .isArray().withMessage('Images must be an array of strings'),

    body('images.*')
      .optional()
      .isString().withMessage('Each image must be a string (URL)')
  ];
};


const searchQueryValidation = () => [
      query('search')
      .optional()
      .isString().withMessage('Search must be a string')
      .trim()
    ];

const cartCreateValidation = () => [
    body("user_id")
      .notEmpty().withMessage("user_id is required")
      .isMongoId().withMessage("user_id must be a valid ObjectId"),
    body("item").notEmpty().withMessage("item is required"),
    body("item.product_id")
      .notEmpty().withMessage("item.product_id is required")
      .isMongoId().withMessage("product_id must be a valid ObjectId"),
    body("item.quantity")
      .notEmpty().withMessage("item.quantity is required")
      .isInt({ min: 1 }).withMessage("quantity must be an integer >= 1"),
  ];

const cartUserParamValidation = () => [
    param("userId").isMongoId().withMessage("Invalid user id"),
  ];

const cartIdParamValidation = () => [
    param("id").isMongoId().withMessage("Invalid cart id"),
  ];

const cartUpdateValidation = () => [
    param("id")
      .notEmpty().withMessage("Cart ID is required")
      .isMongoId().withMessage("Invalid cart ID"),

    body("quantity")
      .notEmpty().withMessage("Quantity is required")
      .isInt({ min: 1 }).withMessage("Quantity must be an integer >= 1")
  ];

const orderCreateValidation = () => [
  body("user_id")
    .notEmpty().withMessage("user_id is required")
    .isMongoId().withMessage("user_id must be a valid ObjectId"),

  body("items")
    .isArray({ min: 1 }).withMessage("items must be an array with at least 1 product")
    .custom((items) => {
      for (const item of items) {
        if (!item.product_id) throw new Error("product_id is required in each item");
        if (!/^[0-9a-fA-F]{24}$/.test(item.product_id)) throw new Error("product_id must be a valid ObjectId");
        if (item.quantity == null) throw new Error("quantity is required in each item");
        if (!Number.isInteger(item.quantity) || item.quantity < 1) throw new Error("quantity must be an integer >= 1");
        if (item.price_at_purchase == null) throw new Error("price_at_purchase is required in each item");
        if (typeof item.price_at_purchase !== "number" || item.price_at_purchase < 0) throw new Error("price_at_purchase must be a number >= 0");
      }
      return true;
    }),

  body("shipping_address").notEmpty().withMessage("shipping_address is required"),
  body("shipping_address.city")
    .notEmpty().withMessage("city is required")
    .isString().withMessage("city must be a string"),
  body("shipping_address.street")
    .notEmpty().withMessage("street is required")
    .isString().withMessage("street must be a string"),

  body("payment_status")
    .optional()
    .isIn(["pending", "paid", "failed", "cancelled", "refunded"])
    .withMessage("payment_status must be one of pending, paid, failed, cancelled, refunded"),

  body("total_price")
    .notEmpty().withMessage("total_price is required")
    .isFloat({ min: 0 }).withMessage("total_price must be a number >= 0"),
];

const orderIdParamValidation = () => [
    param("id")
      .notEmpty().withMessage("Order ID is required")
      .isMongoId().withMessage("Order ID must be a valid ObjectId")
  ];

const orderUpdateValidation = () => [
    body("payment_status")
      .optional()
      .isIn(["pending", "paid", "failed", "cancelled", "refunded"])
      .withMessage("Invalid payment status"),

    body("shipping_address.city")
      .optional()
      .isString().withMessage("City must be a string"),

    body("shipping_address.street")
      .optional()
      .isString().withMessage("Street must be a string"),
  ];

const updateOrderFromUserValidation = () => [
    body("shipping_address").notEmpty().withMessage("shipping_address is required"),
    body("shipping_address.city")
      .notEmpty().withMessage("City is required")
      .isString().withMessage("City must be a string"),
    body("shipping_address.street")
      .notEmpty().withMessage("Street is required")
      .isString().withMessage("Street must be a string"),
  ];

const updateOrderFromAdminValidation = () => [
    body("shipping_address").optional(),
    body("shipping_address.city")
      .optional()
      .isString().withMessage("City must be a string"),
    body("shipping_address.street")
      .optional()
      .isString().withMessage("Street must be a string"),

    body("total_price")
      .optional()
      .isFloat({ min: 0 }).withMessage("Total price must be >= 0"),

    body("payment_status")
      .optional()
      .isIn(["pending", "paid", "failed", "cancelled", "refunded"])
      .withMessage("Payment status must be a valid status"),
  ];

const userIdParamValidation = () => [
    param("id")
      .notEmpty().withMessage("User ID is required")
      .isMongoId().withMessage("User ID must be a valid ObjectId")
  ];

const productIdParamValidation = () => [
    param("productId")
      .notEmpty().withMessage("Product ID is required")
      .isMongoId().withMessage("Product ID must be a valid ObjectId")
  ];

const validateStatusQuery = () => [
    query("status")
      .notEmpty().withMessage("Status query parameter is required")
      .isIn(['pending', 'paid', 'failed', 'cancelled', 'refunded'])
      .withMessage("Invalid status. Valid statuses: pending, paid, failed, cancelled, refunded"),

    query("page")
      .optional()
      .isInt({ min: 1 }).withMessage("Page must be an integer >= 1"),

    query("limit")
      .optional()
      .isInt({ min: 1 }).withMessage("Limit must be an integer >= 1"),
  ];

const validateTimeRangeQuery = () => [
    query("start")
      .notEmpty().withMessage("Start date is required")
      .isISO8601().withMessage("Start date must be a valid ISO8601 date"),

    query("end")
      .notEmpty().withMessage("End date is required")
      .isISO8601().withMessage("End date must be a valid ISO8601 date"),

    query("page")
      .optional()
      .isInt({ min: 1 }).withMessage("Page must be an integer >= 1"),

    query("limit")
      .optional()
      .isInt({ min: 1 }).withMessage("Limit must be an integer >= 1"),
  ];

module.exports = {
  pageValidation,
  registrationValidation,
  loginValidation,
  updateValidation,
  handleValidationErrors,
  searchEmailValidation,
  categoryCreateValidation,
  categoryUpdateValidation,
  productCreateValidation,
  productUpdateValidation,
  searchQueryValidation,
  cartCreateValidation,
  cartUserParamValidation,
  cartIdParamValidation,
  cartUpdateValidation,
  orderCreateValidation,
  orderIdParamValidation,
  orderUpdateValidation,
  updateOrderFromUserValidation,
  updateOrderFromAdminValidation,
  userIdParamValidation,
  productIdParamValidation,
  validateStatusQuery,
  validateTimeRangeQuery
};
