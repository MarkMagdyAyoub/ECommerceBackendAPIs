const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validationSchema = require('../middlewares/validationSchema');
const authentication = require('../middlewares/authentication');

router.post(
  "/",
  authentication.isAuthenticated,  
  authentication.isAdmin,            
  ...validationSchema.productCreateValidation(),  
  validationSchema.handleValidationErrors,     
  productController.createProduct
);

router.get(
  "/",
  ...validationSchema.pageValidation(),           
  ...validationSchema.searchQueryValidation(),
  validationSchema.handleValidationErrors,
  productController.getProductPage
);

router.get(
  "/:id",
  productController.getProductById
);

router.put(
  "/:id",
  authentication.isAuthenticated,
  authentication.isAdmin,
  ...validationSchema.productUpdateValidation(), 
  validationSchema.handleValidationErrors,
  productController.updateProduct
);

router.delete(
  "/:id",
  authentication.isAuthenticated,
  authentication.isAdmin,
  productController.deleteProductById
);

router.all(/.*/, (req, res) => {
    res.status(404).json({
        status: "fail",
        data: { route: "Route not found" }
    });
});


module.exports = router;
