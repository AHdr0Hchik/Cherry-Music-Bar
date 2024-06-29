const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// common

router.get('/', adminController.home)

//stats

router.get('/stats', adminController.stats);

router.post('/get_stats', adminController.get_stats);

//tables and orders

router.get('/tables', adminController.tables);

router.get('/tables/add_to_table', adminController.add_to_table);

router.get('/tables/remove_from_table', adminController.remove_from_table);

router.get('/tables/complete_order', adminController.complete_order);

router.post('/to_proccess_crm', adminController.to_proccess_crm);

router.post('/post_remove_from_table', adminController.post_remove_from_table);

router.post('/tables/complete_order_handler', adminController.complete_order_handler);

//nomenclature

router.get('/nomenclature', adminController.nomenclature);

router.get('/nomenclature/item_edit', adminController.item_edit);

router.get('/nomenclature/edit_subcategory', adminController.subcategory_edit);

router.get('/nomenclature/delete_subcategory', adminController.subcategory_delete);

router.post('/nomenclature/add_orderLine', adminController.add_orderLine);

router.get('/nomenclature/item_delete', adminController.item_delete);

router.post('/nomenclature/subcategory_handler', adminController.subcategory_handler);


//pos

router.get('/pos_manager', adminController.pos_manager);

router.get('/pos_manager/pos_edit', adminController.pos_edit);

router.get('/pos_manager/pos_delete', adminController.pos_delete);

router.post('/pos_manager/pos_update', adminController.pos_update);

//categories

router.get('/categories_manager', adminController.categories_manager);

router.get('/categories_manager/category_edit', adminController.category_edit);

router.get('/categories_manager/category_delete', adminController.category_delete);

router.post('/categories_manager/category_update', adminController.category_update);

//personal

router.get('/personal_manager', adminController.personal_manager);

router.get('/personal_manager/personal_editor', adminController.personal_editor);

router.post('/personal_manager/personal_update', adminController.personal_update);

router.get('/personal_manager/personal_delete', adminController.personal_delete);

//printer

router.get('/printer/draw_prechek', adminController.draw_prechek);

module.exports = router;

//sales

router.get('/sales_manager', adminController.sales_manager);

router.get('/sales_manager/sale_edit', adminController.sale_edit);

router.post('/sales_manager/sale_update', adminController.sale_update);

router.get('/sales_manager/sale_delete', adminController.sale_delete);

//stoplist

router.get('/stoplist_manager', adminController.stoplist_manager);

router.get('/stoplist_manager/stoplist_edit', adminController.stoplist_edit);

router.post('/stoplist_manager/stoplist_update', adminController.stoplist_update);

router.get('/stoplist_manager/stoplist_delete', adminController.stoplist_delete);

//settings

router.get('/settings/import', adminController.import);

//cash

router.get('/cash_manager', adminController.cash_manager);

router.post('/cash_manager/cash_update', adminController.cash_update);