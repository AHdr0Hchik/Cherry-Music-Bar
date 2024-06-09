const express = require('express');
const apiController = require('../controllers/apiController');

const router = express.Router();

router.post('/getMenu', apiController.getMenu);

router.post('/getOrders', apiController.getOrders);

router.get('/getOrderLine/:orderline_id', apiController.getOrderLine);

router.get('/getOrderById/:order_id', apiController.getOrderById);

router.get('/getPricelist/', apiController.getPricelist);

