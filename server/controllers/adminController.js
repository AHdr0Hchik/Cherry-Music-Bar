const Database = require('../classes/Database');
const path = require('path');
const AdminStats = require('../classes/adminStats');
const Tables = require('../classes/Tables');
const Token = require('../classes/Token');
const ApiError = require('../classes/exceptions/api-error');
const Order = require('../classes/Order');

const db = new Database;

const createPath = (page) => path.resolve(__dirname, '../../public', `${page}.ejs`);

exports.home = async (req, res) => {
    res.render(createPath('admin_home'), {isAuthorized: true});
}

exports.addMenu = async (req, res) => {
    const [categories] = await db.connection.promise().query(`SELECT id, category_name FROM menu_categories`);
    const [subcategories] = await db.connection.promise().query(`SELECT id, subcategory_name FROM menu_subcategories`);
    const category = 'add_menu';
    res.render(createPath(`${category}`), {categories: categories ,subcategories: subcategories});
}

exports.add_dish = async (req, res) => {
    if(req.query.subcategory != 11) {
       await db.connection.promise().query(`INSERT INTO menu (category, subcategory, name, description, price) VALUES (${parseInt(req.query.category)},${parseInt(req.query.subcategory)},${req.query.name},${req.query.description},${parseFloat(req.query.price)})`);
    }
    res.redirect('/add_menu');
}

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

exports.tables = async (req, res) => {
    const tables = await new Tables().getTables();
    const [orders] = await db.connection.promise().query('SELECT * FROM History where pos<>"site" and isComplete="0"');
    const [users] = await db.connection.promise().query('SELECT id, firstName FROM Users WHERE role="admin"');

    orders.forEach(order => {
        order.orderLineArray = JSON.parse(order.orderLineArray);
        const user = users.find(user => user.id === order.agentId);
        if (user) {
          order.name = user.firstName;
        }
    });

    return res.render(createPath('tables'), {tables: tables, orders: orders});
}

exports.add_to_table = async (req, res) => {
    try {
        const token = new Token;
        const refreshToken = req.cookies.refreshToken;
        const userData = await token.decodeToken(refreshToken);
        const order = new Order();

        //table checker
        order.Pos(`${req.query.id}:${req.query.count}`);
        console.log(req.query);
        if(await order.findOrderByPos() && req.query.new === '1') {
            return res.redirect('/admin/tables');
        }

        //table info
        const [table_name] = await db.connection.promise().query('SELECT name FROM pos WHERE id=?', [req.query.id]);
        const table_info = {id: req.query.id, name: table_name[0].name, count: req.query.count};

        const [orderDataRaw]= await db.connection.promise().query('SELECT orderLineArray FROM History WHERE isComplete=0 AND pos=?', [`${table_info.id}:${table_info.count}`]);
        if(orderDataRaw.length>0) {
            var orderData = JSON.parse(orderDataRaw[0].orderLineArray);
        }
    
        const [categories] = await db.connection.promise().query(`SELECT * FROM menu_categories`);
        const [subcategories] = await db.connection.promise().query(`SELECT * FROM menu_subcategories`);
        const [menu] = await db.connection.promise().query(`SELECT * FROM menu`);
        
        return res.render(createPath('new_table'), {table_info: table_info, categories: categories, subcategories: subcategories, menu: menu, userData: userData, orderData: orderData});
    } catch(e) {
        console.log(e);
        return ApiError.UnknownError();
    }
}

exports.to_proccess_crm = async (req, res) => {
    try {
        console.log(req.body);
        const agentId_pos = req.body.orderDetails.split('_');
        const order = new Order();
        order.Pos(agentId_pos[1]);
        if(await order.findOrderByPos()) {
            await order.updateOrderLineArray(req.body.itemsData);
        } else {
            order.AgentId(agentId_pos[0]);
            order.OrderLineArray(req.body.itemsData);
            order.calculateTotalCost();
            order.createOrder();
        }

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
        console.log(order);
    } catch(e) {
        console.log(e);
        return ApiError.UnknownError();
    }
};