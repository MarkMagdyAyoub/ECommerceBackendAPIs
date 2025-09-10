const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validationSchema = require('../middlewares/validationSchema');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');

router.route('/')
  .get(validationSchema.pageValidation() , userController.getUsersPage)
  .post(validationSchema.registrationValidation() , userController.registration);

  
router.post('/login'  , validationSchema.loginValidation() , userController.login);

router.get('/verify/:token' , userController.verifyAccount);


router.route('/:id')
  .get(
    authentication.isAuthenticated , 
    authorization.isAdminOrUserOwner,
    ...validationSchema.userIdParamValidation() , 
    validationSchema.handleValidationErrors , 
    userController.getUserById
  )
  .delete(authentication.isAuthenticated , userController.deleteUserAccount)
  .put(authentication.isAuthenticated,  userController.updateUserAccount);

router.get('/email/:email', 
  authentication.isAuthenticated, 
  authentication.isAdmin, 
  ...validationSchema.searchEmailValidation(), 
  validationSchema.handleValidationErrors, 
  userController.getUserAccountByEmail
);

router.put('/assign/:email' ,
  authentication.isAuthenticated,
  authentication.isAdmin,
  ...validationSchema.searchEmailValidation(),
  validationSchema.handleValidationErrors,
  userController.assignAdmin
);

router.all(/.*/, (req, res) => {
    res.status(404).json({
        status: "fail",
        data: { route: "Route not found" }
    });
});

module.exports = router;
