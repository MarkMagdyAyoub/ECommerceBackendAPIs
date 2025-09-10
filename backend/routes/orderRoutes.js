const express = require("express");
const router = express.Router();
const validationSchema = require('../middlewares/validationSchema');
const orderController = require("../controllers/orderController");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

router.post(
  "/",
  authentication.isAuthenticated,
  authentication.isUser,
  ...validationSchema.orderCreateValidation(),
  validationSchema.handleValidationErrors,
  authentication.isUserIdInTokenEqualUserIdInBody,
  orderController.createOrder
);


router.delete(
  "/:id",
  authentication.isAuthenticated,
  ...validationSchema.orderIdParamValidation(),
  validationSchema.handleValidationErrors,
  authentication.isAdminOrOwner,
  orderController.deleteOrder
);

router.put(
  "/user/:id",
  authentication.isAuthenticated,
  authentication.isUser,
  ...validationSchema.updateOrderFromUserValidation(),
  validationSchema.handleValidationErrors,
  authorization.isOrderOwner,
  orderController.updateOrderFromUser
);


router.put(
  "/admin/:id",
  authentication.isAuthenticated,
  authentication.isAdmin,
  ...validationSchema.updateOrderFromAdminValidation(),
  validationSchema.handleValidationErrors,
  orderController.updateOrderFromAdmin
);

router.get(
  "/:id",
  authentication.isAuthenticated,
  ...validationSchema.orderIdParamValidation(),
  validationSchema.handleValidationErrors,
  authentication.isAdminOrOwner,
  orderController.getOrderById
);

// Get orders by logged-in user
router.get(
  "/user/me",
  authentication.isAuthenticated,
  authentication.isUser,
  orderController.getOrderByUser
);

// get orders by user id 
router.get(
  "/user/:id",
  authentication.isAuthenticated,
  authentication.isAdmin,
  ...validationSchema.userIdParamValidation(),
  validationSchema.handleValidationErrors,
  orderController.getOrderByUserId
);


// Get orders by product
router.get(
  "/product/:productId",
  authentication.isAuthenticated,
  authentication.isAdmin, 
  ...validationSchema.productIdParamValidation(),
  validationSchema.handleValidationErrors,
  orderController.getOrderByProduct
);

// Get orders by status
router.get(
  "/status",
  authentication.isAuthenticated,
  authentication.isAdmin,
  ...validationSchema.validateStatusQuery(),
  validationSchema.handleValidationErrors,
  orderController.getStatusPage
);

// Get orders within time range
router.get(
  "/range",
  authentication.isAuthenticated,
  authentication.isAdmin,
  ...validationSchema.validateTimeRangeQuery(),
  validationSchema.handleValidationErrors,
  orderController.getOrdersWithinTimeRange
);

router.all(/.*/, (req, res) => {
    res.status(404).json({
        status: "fail",
        data: { route: "Route not found" }
    });
});

module.exports = router;