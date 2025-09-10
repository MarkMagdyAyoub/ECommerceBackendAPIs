const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authentication = require('../middlewares/authentication');
const validationSchema = require('../middlewares/validationSchema'); 

router.get('/', categoryController.getCategoryPage);

router.get('/name/:name', categoryController.getCategoryByName);

router.get('/:id', categoryController.getCategoryById);

router.post(
  '/',
  authentication.isAuthenticated,
  authentication.isAdmin,
  ...validationSchema.categoryCreateValidation(),
  validationSchema.handleValidationErrors,
  categoryController.createCategory
);

router.put(
  '/:id',
  authentication.isAuthenticated,
  authentication.isAdmin,
  ...validationSchema.categoryUpdateValidation(),
  validationSchema.handleValidationErrors,
  categoryController.updateCategory
);

router.delete(
  '/:id', 
  authentication.isAuthenticated, 
  authentication.isAdmin, 
  categoryController.deleteCategory
);

router.all(/.*/, (req, res) => {
    res.status(404).json({
        status: "fail",
        data: { route: "Route not found" }
    });
});

module.exports = router;
