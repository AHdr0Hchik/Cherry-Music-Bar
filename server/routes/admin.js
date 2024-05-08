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

router.get('/nomenclature/edit_subcategory', adminController.subcategory_edit);

router.get('/nomenclature/delete_subcategory', adminController.subcategory_delete);

router.get('/pos_manager', adminController.pos_manager);

router.get('/pos_manager/pos_edit', adminController.pos_edit);

router.get('/pos_manager/pos_delete', adminController.pos_delete);

router.get('/categories_manager', adminController.categories_manager);

router.get('/categories_manager/category_edit', adminController.category_edit);

router.get('/categories_manager/category_delete', adminController.category_delete);

router.get('/personal_manager', adminController.personal_manager);

router.get('/personal_manager/personal_editor', adminController.personal_editor);

router.get('/printer/draw_prechek', adminController.draw_prechek);
//post

router.post('/get_stats', adminController.get_stats);

router.post('/to_proccess_crm', adminController.to_proccess_crm);

router.post('/tables/complete_order_handler', adminController.complete_order_handler);

router.post('/nomenclature/add_orderLine', adminController.add_orderLine);

router.post('/nomenclature/subcategory_handler', adminController.subcategory_handler)

router.post('/pos_manager/pos_update', adminController.pos_update);

router.post('/categories_manager/category_update', adminController.category_update);


module.exports = router;