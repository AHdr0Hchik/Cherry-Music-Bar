const express = require('express');
const orderController = require('../controllers/orderController');
const roleMiddleware = require('../middlewares/role-middleware');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();

router.post('/toProcess', orderController.toProcess);

router.post('/createOrder', orderController.createOrder);

module.exports = router;