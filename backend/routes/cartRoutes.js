const express = require("express");
const router = express.Router();
const validationSchema = require('../middlewares/validationSchema');
const cartController = require("../controllers/cartController");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

router.route("/")
  .post(
    authentication.isAuthenticated,
    authentication.isUser,
    ...validationSchema.cartCreateValidation(),
    validationSchema.handleValidationErrors,
    authentication.isUserIdInTokenEqualUserIdInBody,
    cartController.createCart
  )
  .get(
    authentication.isAuthenticated, 
    authentication.isAdmin, 
    cartController.getAllCarts
  );

router.route("/user/:userId")
  .get(
    authentication.isAuthenticated , 
    ...validationSchema.cartUserParamValidation() ,
    validationSchema.handleValidationErrors,
    authentication.isUserIdInTokenEqualUserIdInParams,
    cartController.getAllCartsByUser
  );

router.route("/:id")
  .get(
    authentication.isAuthenticated, 
    ...validationSchema.cartIdParamValidation(),
    validationSchema.handleValidationErrors,
    cartController.getCartById
  )
  .put(
    authentication.isAuthenticated,
    authentication.isUser,
    ...validationSchema.cartUpdateValidation(),
    validationSchema.handleValidationErrors,
    authorization.isCartOwner,
    cartController.updateCart
  )
  .delete(
    authentication.isAuthenticated,
    authentication.isUser,
    ...validationSchema.cartIdParamValidation(),
    validationSchema.handleValidationErrors,
    authorization.isCartOwner,
    cartController.deleteCart
  );

router.all(/.*/, (req, res) => {
    res.status(404).json({
        status: "fail",
        data: { route: "Route not found" }
    });
});


module.exports = router;
