const express = require('express');
const pageController = require('../controllers/pageController')
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();

//main pages
router.get('/', pageController.index);

router.get('/subcategories', pageController.subcategories);

router.get('/menu', pageController.menu);

//auth pages
router.get('/register', pageController.register);

router.get('/login', pageController.login);

router.get('/profile', authMiddleware, pageController.profile);

router.get('/forgot_password', pageController.forgot_password);



module.exports = router;
