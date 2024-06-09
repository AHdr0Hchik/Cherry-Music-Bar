const path = require('path');
const Model = require('../models');

const createPath = (page) => path.resolve(__dirname, '../../public', `${page}.ejs`);

exports.getMenu = async (req, res) => {
    const result = await Model.menu.findAll();
    res.json(JSON.stringify(result));
}

exports.getOrders = async (req, res) => {
    const result = await Model.history.findAll();
    res.json(JSON.stringify(result));
}

exports.getOrderLine = async (req, res) => {
    const result = await Model.menu.findOne({
        where: { id: req.params.orderline_id }
    })
    res.json(JSON.stringify(result));
}

exports.getOrderById = async (req, res) => {
    const result = await Model.history.findOne({
        where: { 
            id: req.params.order_id,
            isComplete: 0
        }
    });
    res.json(JSON.stringify(result));
}

exports.getPricelist = async (req, res) => {
    const result = await Model.pricelist.findAll();
    res.json(JSON.stringify(result));
}