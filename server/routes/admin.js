const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/', adminController.home)

router.get(`/add_menu`, adminController.addMenu);

router.get('/add_dish', adminController.add_dish);

router.get('/stats', adminController.stats);

router.get('/tables', adminController.tables);

router.get('/tables/add_to_table', adminController.add_to_table);

router.get('/tables/complete_order', adminController.complete_order);

router.get('/nomenclature', adminController.nomenclature);

router.get('/nomenclature/item_edit', adminController.item_edit);

router.get('/pos_manager', adminController.pos_manager);

//post

router.post('/get_stats', adminController.get_stats);

router.post('/to_proccess_crm', adminController.to_proccess_crm);

router.post('/tables/complete_order_handler', adminController.complete_order_handler);

router.post('/nomenclature/add_orderLine', adminController.add_orderLine);


module.exports = router;