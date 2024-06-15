const Database = require('../classes/Database');
const path = require('path');
const AdminStats = require('../classes/adminStats');
const Token = require('../classes/Token');
const ApiError = require('../classes/exceptions/api-error');
const Order = require('../classes/Order');
const OrderLine = require('../classes/OrderLine');
const Model = require('../models');
const Printer = require('../classes/Printer');
const SBIS = require('../sbis/SBIS');
const request = require('request');

const db = new Database;

const createPath = (page) => path.resolve(__dirname, '../../public', `${page}.ejs`);

//common

exports.home = async (req, res) => {
    res.render(createPath('admin_home'), {isAuthorized: true});
}

//stats

exports.stats = async (req, res) => {
    const adminStats = new AdminStats();
    res.render(createPath('stats'), {dto: await adminStats.getDto()});
} 

exports.get_stats = async (req, res) => {
    const adminStats = new AdminStats();

    const dateStart = new Date(parseInt(req.body.ts_y), parseInt(req.body.ts_m)-1, parseInt(req.body.ts_d), parseInt(req.body.ts_hour)+3).toISOString().slice(0, 19).replace('T', ' ');
    const dateFinish = new Date(parseInt(req.body.tf_y), parseInt(req.body.tf_m)-1, parseInt(req.body.tf_d), parseInt(req.body.tf_hour)+3).toISOString().slice(0, 19).replace('T', ' ');
    
    if(req.body.checkOrderHistory) {
        const orderHistory = await adminStats.getOrderHistory(dateStart, dateFinish);
        return res.render(createPath('stats'), {dto: await adminStats.getDto(), orderHistory: orderHistory});
    }

    const dishHistory = await adminStats.getDishHistory(dateStart, dateFinish);
    return res.render(createPath('stats'), {dto: await adminStats.getDto(), dishHistory: dishHistory});
}

//tables and orders

exports.tables = async (req, res) => {
    const token = new Token;
    const userData = await token.decodeToken(req.cookies.refreshToken);

    const tables = await Model.pos.findAll({
        where: {
          [Model.Op.or]: [
            Model.sequelize.literal(`FIND_IN_SET(${userData.id}, can_works) > 0`),
            {can_works: '-1'}
          ]
        }
    });
    const sales = await Model.sales.findAll({
        where: { expiredIn : { [Model.Op.gte]: new Date() } }
    });
    const [orders] = await db.connection.promise().query('SELECT * FROM History where pos<>"site" and isComplete="0"');
    const [users] = await db.connection.promise().query('SELECT id, firstName FROM Users WHERE role="admin"');

    orders.forEach(order => {
        order.orderLineArray = JSON.parse(order.orderLineArray);
        const user = users.find(user => user.id === order.agentId);
        if (user) {
          order.name = user.firstName;
        }
    });

    return res.render(createPath('tables'), {tables: tables, orders: orders, sales: sales});
}

exports.add_to_table = async (req, res) => {
    try {
        const token = new Token;
        const refreshToken = req.cookies.refreshToken;
        const userData = await token.decodeToken(refreshToken);
        const order = new Order();

        //table checker
        order.Pos(`${req.query.id}:${req.query.count}`);
        if(await order.findOrderByPos() && req.query.new === '1') {
            return res.redirect('/admin/tables');
        }

        const pricelist = await Model.pricelist.findAll();

        //table info
        let tableData = await Model.pos.findOne({
            attributes: ['id', 'name', 'can_sells'],
            where: {
                id: parseInt(req.query.id)
            }
        });
        
        const table_info = {id: req.query.id, name: tableData.name, count: req.query.count, can_sells: tableData.can_sells};

        const [orderDataRaw]= await db.connection.promise().query('SELECT orderLineArray FROM History WHERE isComplete=0 AND pos=?', [`${table_info.id}:${table_info.count}`]);
        if(orderDataRaw.length>0) {
            var orderData = JSON.parse(orderDataRaw[0].orderLineArray);
        }
        let categories;

        if(tableData.can_sells==='-1') {
            categories = await Model.categories.findAll({
                where: {
                    hidden: 0
                }
            });
        } else {
            const categoryIds = tableData.can_sells.split(',').map(Number);

            categories = await Model.categories.findAll({
                where: {
                    [Model.Op.and]: [
                        {id: categoryIds},
                        {hidden: 0}
                    ]
                
                }
            });
        }
        const stoplist = await Model.stoplist.findAll();

        const [subcategories] = await db.connection.promise().query(`SELECT * FROM menu_subcategories`);
        const [menu] = await db.connection.promise().query(`SELECT * FROM menu`);
        
        return res.render(createPath('new_table'),
        {
            table_info: table_info,
            categories: categories, 
            subcategories: subcategories, 
            menu: menu,
            userData: userData, 
            orderData: orderData,
            pricelist: pricelist,
            stoplist: stoplist
        });
    } catch(e) {
        console.log(e);
        return ApiError.UnknownError();
    }
}

exports.remove_from_table = async (req, res) => {
    try {
        const token = new Token;
        const refreshToken = req.cookies.refreshToken;
        const userData = await token.decodeToken(refreshToken);
        const order = new Order();

        //table checker
        order.Pos(`${req.query.id}:${req.query.count}`);
        if(await order.findOrderByPos() && req.query.new === '1') {
            return res.redirect('/admin/tables');
        }

        //table info
        let tableData = await Model.pos.findOne({
            attributes: ['id', 'name', 'can_sells'],
            where: {
                id: parseInt(req.query.id)
            }
        });
        
        const table_info = {id: req.query.id, name: tableData.name, count: req.query.count, can_sells: tableData.can_sells};

        const [orderDataRaw]= await db.connection.promise().query('SELECT orderLineArray FROM History WHERE isComplete=0 AND pos=?', [`${table_info.id}:${table_info.count}`]);
        if(orderDataRaw.length>0) {
            var orderData = JSON.parse(orderDataRaw[0].orderLineArray);
        }
        const orderSum = await Model.history.findOne(
            {
                where: {pos: `${table_info.id}:${table_info.count}`, isComplete: 0}
            }
        );
        
        return res.render(createPath('table_edit'), {table_info: table_info, userData: userData, orderData: orderData, orderSum: orderSum.sum});
    } catch(e) {
        console.log(e);
        return ApiError.UnknownError();
    }
}

exports.post_remove_from_table = async (req, res) => {
    try {
        let order = new Order(req.body.itemsData);
        const sums = await order.calculateTotalCost();
        await Model.history.update(
            {
                orderLineArray: JSON.stringify(req.body.itemsData),
                sum: sums.sum,
                sumWithSale: sums.sumWithSale
            },
            { 
                where: {pos: req.body.orderDetails.split('_')[1], isComplete: 0}
            }
        )

    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError();
    }
    
}

exports.to_proccess_crm = async (req, res) => {
    try {
        const agentId_pos = req.body.orderDetails.split('_');
        const order = new Order();
        order.Pos(agentId_pos[1]);
        if(await order.findOrderByPos()) {
            await order.updateOrderLineArray(req.body.itemsData);
            if(order.guests_count != req.body.guests_count) {
                await Model.history.update(
                    {
                        guests_count: req.body.guests_count
                    },
                    {   
                        where: { 
                                pos: order.pos, 
                                isComplete: 0 
                            }
                    }
                );
            }
        } else {
            order.AgentId(agentId_pos[0]);
            order.OrderLineArray(req.body.itemsData);
            await order.calculateTotalCost();
            await order.createOrder();
            await Model.history.update(
                {
                    guests_count: req.body.guests_count
                },
                {   
                    where: { 
                            pos: order.pos, 
                            isComplete: 0 
                        }
                }
            );
        }
        const printer = new Printer;
        
        await printer.draw_info(req.body.itemsData, req.body.orderDetails);

        return res.redirect('/admin/tables');
    } catch(e) {
        console.log(e);
        return ApiError.UnknownError();
    }
}

exports.complete_order = async (req, res) => {
    
    const order = new Order();
    order.Id(req.query.order_id);
    
    if(!await order.findOrderById()) {
        return res.redirect('/admin/tables');
    }

    const sales = await Model.sales.findAll({
        where: { expiredIn : { [Model.Op.gte]: new Date() } }
    });
    const orderLineIds = order.orderLineArray.map(item => item.id);
    const menu = await Model.menu.findAll({
        where: {
            id: orderLineIds
        }
    });
    //const updatedOrderLines = applyDiscounts(order.orderLineArray, menu, sales);
    order.applyDiscounts(menu, sales);
    order.calculateTotalCost();
    return res.render(createPath('complete_order'), {order: order});
};

exports.complete_order_handler = async (req, res) => {
    try{
        const order = new Order();
        order.Id(req.body.order_id);
        await order.findOrderById();
        
        order.Sale(parseInt(req.body.sale));
        await order.calculateTotalCost();
        await order.updateOrder();
        await order.isComplete();
        const official = await order.findOfficialLines();
        if(official.length>0) {
            const sbis = new SBIS;
            //sbis.billRegistrationForCash(official);
        }

        const printer = new Printer();
        const pos_name = await Model.pos.findOne({
            attributes: ['name'],
            where: {
                id: order.pos.split(':')[0]
            }
        });
        order.pos=  pos_name.name + ':' + order.pos.split(':')[1];
        order.agentId = 'Андрей Хоменко';
        console.log(356);
        console.log(order);
        console.log(123);
        printer.printOrder(order, true);
    } catch(e) {
        console.log(e);
        return ApiError.UnknownError();
    }
};

//nomenclature

exports.nomenclature = async (req, res) => {
    try {
        const [subcategories] = await db.connection.promise().query('SELECT * FROM menu_subcategories WHERE type=?;', [req.query.type]);
        const [categories] = await db.connection.promise().query('SELECT id, category_name FROM menu_categories');
        const [rawMenu] = await db.connection.promise().query('SELECT * FROM menu');
    
        const menu = Object.values(rawMenu.reduce((acc, item) => {
            const subcategory = item.subcategory;
            if (!acc[subcategory]) {
              acc[subcategory] = [];
            }
            acc[subcategory].push(item);
            return acc;
        }, {}));
        const pricelist = await Model.pricelist.findAll();
        return res.render(createPath('nomenclature'), {subcategories: subcategories, pricelist: pricelist, categories: categories, menu: menu, type: req.query.type});      
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError();
    }
    
}

exports.item_edit = async (req, res) => {
    try {
        let subcategories;
        if(req.query.type) {
            [subcategories] = await db.connection.promise().query('SELECT * FROM menu_subcategories WHERE type = ?;', [req.query.type]);
        } else {
            [subcategories] = await db.connection.promise().query('SELECT * FROM menu_subcategories;');
        }
        const [components_cats] = await db.connection.promise().query('SELECT * FROM menu_subcategories WHERE type<>"production"');
        const [components] = await db.connection.promise().query('SELECT menu.*, menu_subcategories.id AS subcategory_id, menu_subcategories.subcategory_name, menu_subcategories.type FROM menu JOIN menu_subcategories ON menu.subcategory = menu_subcategories.id WHERE menu_subcategories.type<>"production"');
        
        const [packs] = await db.connection.promise().query('SELECT id, name FROM menu WHERE subcategory=15;');

        if(!req.query.orderLine) {
            return res.render(createPath('item_edit'), {subcategories: subcategories, packs: packs, type: req.query.type});
        }
        const [orderLine] = await db.connection.promise().query('SELECT * FROM menu WHERE id=?', [parseInt(req.query.orderLine)]);
        const sizes = await Model.pricelist.findAll({
            where: { dish_id: req.query.orderLine }
        })
        let subcategory = subcategories.find(item => item.id == orderLine[0].subcategory);
        if (subcategory) {
            orderLine[0].type = subcategory.type;
        }
        if(!orderLine[0]) {
            return ApiError.UnknownError();
        }
        return res.render(createPath('item_edit'), {orderLine: orderLine[0], sizes: sizes, subcategories: subcategories, packs: packs});
    } catch(e) {
        console.log(e);
        return ApiError.UnknownError();
    }
}

exports.item_delete = async (req, res) => {
    try {
        const orderLine = await Model.menu.findOne({
            where: { id: req.query.orderLine}
        });
        if(!orderLine) {
            return res.redirect('/admin/nomenclature?type=production');
        }
        await Model.menu.destroy({
            where: { id: req.query.orderLine }
        });
        await Model.pricelist.destroy({
            where: { dish_id: req.query.orderLine }
        });

    } catch(e) {
        console.log(e);
    } finally {
        return res.redirect('/admin/nomenclature?type=production');
    }
}

exports.subcategory_delete = async (req, res) => {
    try {
        if(!req.query.id) return res.redirect(`/admin/nomenclature?type=${req.query.type}`);
        await Model.subcategories.destroy({
            where: {
                id: parseInt(req.query.id)
            }
        });
        await Model.menu.destroy({
            where: {
                subcategory: parseInt(req.query.id)
            }
        })
        return res.redirect(`/admin/nomenclature?type=${req.query.type}`);
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError();
    }
}

exports.subcategory_edit = async (req, res) => {
    try {
        const categories = await Model.categories.findAll({
            where: {
                hidden: 0
            }
        });
        let subcategory;
        if(req.query.id) {
            subcategory = await Model.subcategories.findOne({
                where: {
                    id: req.query.id
                }
            });
        }
        return res.render(createPath('edit_subcategory'), {subcategory: subcategory,categories: categories, type: req.query.type});
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError
    }
}

exports.subcategory_handler = async (req, res) => {
    try {
        Model.subcategories.findOne({
            where: {
                id: req.body.subcategory_id
            }
        }).then(count => {
            if(count) {
                return Model.subcategories.update(
                {
                    type: req.body.type,
                    subcategory_name: req.body.subcategory_name,
                    category: parseInt(req.body.category_id),
                    hidden: req.body.hidden=='on' ? 1 : 0
                },
                {
                    where: {
                        id: count.id
                    }
                });
            }
            return Model.subcategories.create({
                type: req.body.type,
                subcategory_name: req.body.subcategory_name,
                category: parseInt(req.body.category_id),
                hidden: req.body.hidden=='on' ? 1 : 0
            });
        });
        return res.redirect(`/admin/nomenclature?type=production`)
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError;
    }
}

exports.add_orderLine = async (req, res) => {
    try {
        const orderLine = new OrderLine(req.body.itemData.name, req.body.itemData.subcategory);
        await orderLine.setCategoryBySubcategory();
        /*if(req.body.itemData.prices.price) {
            orderLine.Price(req.body.itemData.prices.price);
        } else {
            orderLine.Price30(req.body.itemData.prices.price30);
            orderLine.Price36(req.body.itemData.prices.price36);
            orderLine.Price50(req.body.itemData.prices.price50);
        }*/

        orderLine.ForSite(req.body.itemData.forSite);
        orderLine.WithPack(req.body.itemData.withPack);
        orderLine.Pack_Id(req.body.itemData.pack_id);
        orderLine.Is_official(req.body.itemData.is_official);
        
        if(req.body.new || !req.body.itemData.id) {
            const newOrderLine = await orderLine.addOrderLineToDB();

            const prices = req.body.itemData.prices.map(obj => ({
                ...obj,
                dish_id: newOrderLine.id
              }));

            await Model.pricelist.bulkCreate(prices, {
                fields: ['dish_id', 'size', 'price']
            });
        }

        await Model.pricelist.destroy({
            where: {dish_id: parseInt(req.body.itemData.id)} //удаляем текущие ценники
        })
        await Model.pricelist.bulkCreate(req.body.itemData.prices, {
            fields: ['dish_id', 'size', 'price']
        });
        orderLine.Id(req.body.itemData.id);
        return orderLine.updadeInDB();
    } catch(e) {
        console.log(e);
        return ApiError.UnknownError();
    }
}

//pos

exports.pos_manager = async (req, res) => {
    try {
        const [pos] = await db.connection.promise().query('SELECT * FROM pos;');
        return res.render(createPath('pos_manager'), {pos: pos});
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError();
    }
}

exports.pos_edit = async (req, res) => {
    try {
        const [workers] = await db.connection.promise().query('SELECT id, firstname, lastname FROM users WHERE role<>"default_user";');
        const [categories] = await db.connection.promise().query('SELECT id, category_name FROM menu_categories WHERE hidden=0');
        const warehouses = '';
        const makers = '';
        if(!req.query.pos_id) {
            return res.render(createPath('pos_edit'), {workers: workers, warehouses: warehouses, categories:categories, makers: makers});
        }
        const pos = await Model.pos.findOne({
            where : {
                id: req.query.pos_id
            }
        });

        return res.render(createPath('pos_edit'), {pos:pos, workers: workers, warehouses: warehouses, categories:categories, makers: makers});

        
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError();
    }
}

exports.pos_delete = async (req, res) => {
    try {
        await Model.pos.destroy({
            where: {id: req.query.pos_id }
        });
        return res.redirect(`/admin/pos_manager`);
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError();
    }
}

exports.pos_update = async (req, res) => {
    try {
        console.log(req.body)
        if(!req.body.pos_id) {
            await Model.pos.create({
                name: req.body.pos_name, 
                count: req.body.pos_count, 
                printer: req.body.bills.group_printer == 'printer' ? req.body.bills.printer_address : '', 
                can_works: Array.isArray(req.body.workers) ? req.body.workers.join(', ') : req.body.workers,
                can_sells: Array.isArray(req.body.category) ? req.body.category.join(', ') : req.body.category
            });
            return res.redirect('/admin/pos_manager');
        }
        await Model.pos.update(
            {
                name: req.body.pos_name, 
                count: parseInt(req.body.pos_count), 
                printer: req.body.bills.group_printer == 'printer' ? req.body.bills.printer_address : '', 
                can_works: req.body.workers != '-1' ? req.body.workers.join(', ') : '-1',
                can_sells: req.body.category != '-1' ? req.body.category.join(', '): '-1'
            },
            {
                where: {
                    id: parseInt(req.body.pos_id),
                },
            }
        );
        return res.redirect('/admin/pos_manager');
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError;
    }
}

//categories

exports.categories_manager = async (req, res) => {
    try {
        const categories = await Model.categories.findAll();
        return res.render(createPath('categories_manager'), {categories: categories});
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError();
    }
}

exports.category_edit = async (req, res) => {
    try {
        const pos = await Model.pos.findAll();

        if(!req.query.category_id) {
            return res.render(createPath('category_edit'), {pos: pos});
        }
        const category = await Model.categories.findOne({
            where: { id: req.query.category_id }
        })
        return res.render(createPath('category_edit'), {pos: pos, category: category });

        
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError();
    }
}

exports.category_delete = async (req, res) => {
    try {
        await Model.categories.destroy({
            where: {id: req.query.category_id }
        });
        return res.redirect(`/admin/categories_manager`);
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError();
    }
}

exports.category_update = async (req, res) => {
    try {
        console.log(req.body)
        if(!req.body.category_id) {
            await Model.categories.create({
                category_name: req.body.category_name, 
                printer: req.body.bills.group_printer == 'printer' ? req.body.bills.printer_address : '', 
                is_forSite: req.body.category_is_forSite == 'on' ? '1' : '0',
                hidden: req.body.category_hidden == 'on' ? '1' : '0'
            });
            return res.redirect('/admin/categories_manager');
        }
        await Model.categories.update(
            {
                category_name: req.body.category_name, 
                printer: req.body.bills.group_printer == 'printer' ? req.body.bills.printer_address : '',
                hidden: req.body.category_hidden == 'on' ? '1' : '0',
                is_forSite: req.body.category_is_forSite == 'on' ? '1' : '0',
            },
            {
                where: {
                    id: parseInt(req.body.category_id),
                },
            }
        );
        return res.redirect('/admin/categories_manager');
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError;
    }
}

//personal

exports.personal_manager = async (req, res) => {
    const personal = await Model.users.findAll({
        where: {
            role: process.env.PERSONAL_ROLES.split(', ')
        }
    });
    return res.render(createPath('personal_manager'), {personal: personal});
}
exports.personal_editor = async (req, res) => {
    if(!req.query.worker_id) {
        return res.render(createPath('personal_editor'), {roles: process.env.PERSONAL_ROLES.split(', '), roles_names: process.env.PERSONAL_ROLES_NAMES.split(', ')});
    }

    const workerData = await Model.users.findOne({
        where: {id : parseInt(req.query.worker_id)}
    })
    if(!workerData) {
        return res.redirect('/admin/personal_manager');
    }

    return res.render(createPath('personal_editor'), {roles: process.env.PERSONAL_ROLES.split(', '), roles_names: process.env.PERSONAL_ROLES_NAMES.split(', '), worker: workerData});
}

exports.personal_update = async (req, res) => {
    console.log(req.body);
    const user = await Model.users.findOne({
        where: {
            email: req.body.frm.user_email
        }
    });
    if(!user || (user.role === req.body.frm.user_role)) {
        return res.redirect('/admin/personal_manager');
    }
    await Model.users.update(
        {
            role: req.body.frm.user_role
        },
        {
            where: {
                email: req.body.frm.user_email,
            },
        }
    );
    return res.redirect('/admin/personal_manager');
}

exports.personal_delete = async(req, res) => {
    try {
        await Model.users.update(
            {
                role: 'default'
            },
            {
                where: {
                    id: parseInt(req.query.worker_id),
                },
            }
        );
        return res.redirect(`/admin/personal_manager`);
    } catch(e) {
        console.log(e);
        return res.redirect('/admin/personal_manager');
    }
}

//printer

exports.draw_prechek = async (req, res) => {
    try{
        let order = new Order();
        order.Id(req.query.order_id);
        await order.findOrderById();
        console.log(order);
        const printer = new Printer();
        printer.printOrder(order);
        return res.redirect('/admin/tables');
    } catch(e) {
        console.log(e);
        return ApiError.UnknownError();
    }
};

//sales

exports.sales_manager = async (req, res) => {
    try {
        const sales = await Model.sales.findAll();

        return res.render(createPath('sales_manager'), {sales: sales});
    } catch(e) {
        console.log(e);
        return ApiError.UnknownError();
    }
}

exports.sale_edit = async (req, res) => {
    try {
        const categories = await Model.categories.findAll({
            where: { hidden: 0 }
        });
        const subcategories = await Model.subcategories.findAll({
            where: { hidden: 0}
        });
        const menu = await Model.menu.findAll();

        if(!req.query.sale_id) {
            return res.render(createPath('sale_edit'), {categories: categories, subcategories: subcategories, menu: menu});
        }
        const sale = await Model.sales.findOne({
            where: { id: req.query.sale_id }
        })
        return res.render(createPath('sale_edit'), {sale: sale, categories: categories, subcategories: subcategories, menu: menu});

        
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError();
    }
}

exports.sale_update = async (req, res) => {
    try {
        console.log(req.body)
        if(!req.body.sale_id) {
            await Model.sales.create({
                name: req.body.sale_name,
                target_type: req.body.target_type,
                target_id: req.body.target_id,
                sale: req.body.sale_percent,
                expiredIn: req.body.sale_expiredIn
            });
            return res.redirect('/admin/sales_manager');
        }
        await Model.sales.update(
            {
                name: req.body.sale_name,
                target_type: req.body.target_type,
                target_id: req.body.target_id,
                sale: req.body.sale_percent,
                expiredIn: req.body.sale_expiredIn
            },
            {
                where: {
                    id: parseInt(req.body.sale_id),
                },
            }
        );
        return res.redirect('/admin/sales_manager');
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError;
    }
}

exports.sale_delete = async (req, res) => {
    try {
        await Model.sales.destroy({
            where: {id: req.query.sale_id }
        });
        return res.redirect(`/admin/sales_manager`);
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError();
    }
}

//stoplist

exports.stoplist_manager = async (req, res) => {
    try {
        const stoplistRaw = await Model.stoplist.findAll();
        const subcategories = await Model.subcategories.findAll({
            attributes: ['id'],
            where: {
                hidden: 0,
                type: 'production'
            }
        });
        let ids = subcategories.map(obj => obj.id);
        const menu = await Model.menu.findAll({
            where: { subcategory: ids }
        });

        const stoplist = stoplistRaw.map(item => {
            const menuItem = menu.find(menuItem => menuItem.id === item.dish_id);
            return {
              id: item.id,
              dish_id: item.dish_id,
              name: menuItem ? menuItem.name : null // Убедитесь, что name существует
            };
        });

        return res.render(createPath('stoplist_manager'), {stoplist: stoplist, menu: menu});
    } catch(e) {
        console.log(e);
        return ApiError.UnknownError();
    }
}

exports.stoplist_edit = async (req, res) => {
    try {
        const subcategories = await Model.subcategories.findAll({
            attributes: ['id'],
            where: {
                hidden: 0,
                type: 'production'
            }
        });
        let ids = subcategories.map(obj => obj.id);
        const menu = await Model.menu.findAll({
            where: { subcategory: ids }
        });
        if(!req.query.stoplist_id) {
            return res.render(createPath('stoplist_edit'), {menu: menu});
        }
        const stoplist_item = await Model.stoplist.findOne({
            where: { id: req.query.stoplist_id}
        });
        return res.render(createPath('stoplist_edit'), {menu: menu, stoplist_item: stoplist_item});
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError();
    }
}

exports.stoplist_update = async (req, res) => {
    try {
        console.log(req.body)
        if(!req.body.stoplist_id) {
            await Model.stoplist.create({
                dish_id: req.body.dish_id
            })
            return res.redirect('/admin/stoplist_manager');
        }
        await Model.stoplist.update(
        {
            dish_id: req.body.dish_id,
        },
        {
            where: { id: parseInt(req.body.stoplist_id) }
        });
        return res.redirect('/admin/stoplist_manager');
        console.log(req.body);
        if(req.body.stoplist_item_id) {
            
        }
        
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError;
    }
}

exports.stoplist_delete = async (req, res) => {
    try {
        await Model.stoplist.destroy({
            where: {id: req.query.stoplist_id }
        });
        return res.redirect(`/admin/stoplist_manager`);
    } catch(e) {
        console.log(e);
        throw ApiError.UnknownError();
    }
}
