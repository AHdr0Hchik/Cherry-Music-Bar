const express = require('express');
const authController = require('../controllers/authController');
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();

router.post('/register', body('email').isEmail(), body('password').isLength({min:8, max:32}),authController.register);

router.get('/activate/:link', authController.activate);

router.get('/logout', authController.logout);

router.get('/refresh', authController.refresh);

router.post('/login', authController.login);

router.post('/forgot_password', authController.forgotPassword);

router.get('/getUsers', authMiddleware, authController.getUsers);

router.post('/updatePhoneNumber', authMiddleware, authController.updatePhoneNumber);

router.post('/updateAddress', authMiddleware, authController.updateAddress);



module.exports = router;