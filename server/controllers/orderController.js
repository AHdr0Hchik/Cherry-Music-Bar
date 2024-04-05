const Order = require('../classes/Order');
const Token = require('../classes/Token');


//site
exports.toProcess = async (req, res) => {
    const order = new Order(req.body.itemsData, req.body.address, req.body.numberPhone);
    await order.calculateTotalCost();
    order.Description(`Заказ с сайта. Телефон: ${order.numberPhone}, Адрес: ${order.address}`);
    return await order.createOrder();
}


//crm
exports.createOrder = async (req, res) => {
    console.log(req.body);
    const token = await new Token().decodeToken(req.cookies.refreshToken);
    const agentId = token.id;
    const order = new Order(req.body.itemsData);
    order.AgentId(agentId);
    await order.calculateTotalCost();
    return await order.createOrder();
}