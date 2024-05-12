const Model = require('../models');
const escpos = require('escpos');
const OrderLine = require('./OrderLine');
escpos.Network = require('escpos-network');

class Printer {
    constructor() {
        
    }

    printOrder(order, final) {
        const networkDevice = new escpos.Network(process.env.PRINTER_IP, parseInt(process.env.PRINTER_PORT));
        const printer = new escpos.Printer(networkDevice);
        networkDevice.open(function(error){
            printer
            .font('A')
            .size(1,1)
            .text(process.env.ORG_NAME, 'CP866')
            .text('Где: ' + order.pos , 'CP866')
            .text('Когда: ' + order.orderDate , 'CP866')
            .text('Обслужил: ' + order.agentId, 'CP866');
            let orderLineArray_formatted;
            order.orderLineArray.forEach(orderLine => {
                printer.tableCustom([{text: `${orderLine.name} ${orderLine.size || ''}`}, {text:`${orderLine.count}`}, {text: `${orderLine.price}`}, {text:`${orderLine.count * orderLine.price}`}], { encoding: 'CP866', size: [1, 1] });
                printer.text(`_____________________`, 'CP866');
            })
            printer.style('i').text('Сумма: ' + order.sale==0 ? `${order.sumWithSale}Р` : `${order.sum} - ${(order.sum-order.sumWithSale)} = ${order.sumWithSale}Р` , 'CP866');
            if(final) {
            printer.style('b').text('Приходите ещё :)', 'CP866')
            .cut()
            .close();
            } else {
                printer.style('b').text('Приятного аппетита :)', 'CP866')
                .cut()
                .close();
            }
          });
    }


    async draw_info(itemsData, orderDetails) {
        let categoriesInfo = [];
        for(let item in itemsData) {
            let orderLine = new OrderLine();
            orderLine.Id(parseInt(itemsData[item].id));
            orderLine = await orderLine.getOrderLineById();
            itemsData[item].category = orderLine.category;
            itemsData[item].subcategory = orderLine.subcategory;
            const categoryInfo = await Model.categories.findOne({
                    where: {id: itemsData[item].category }
                }
            );
            if (!categoriesInfo.some(item => item.id === categoryInfo.id)) categoriesInfo.push(categoryInfo);
            console.log(categoriesInfo);
        }
        const pos = await Model.pos.findOne({
            attributes: ['name'],
            where: {id: parseInt(orderDetails.split('_')[1].split(':')[0])}
        })
        const agent = await Model.users.findOne({
            attributes: ['firstname'],
            where: {
                id: parseInt(orderDetails.split('_')[0])
            }
        })

        let text = [];

        categoriesInfo.forEach(category => {
            text.push(`Отдел: ${category.category_name}`);
            text.push(`Время: ${new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()}`);
            text.push(`Пробил: ${agent.firstname}`);
            text.push(`Для: ${pos.name}:${parseInt(orderDetails.split('_')[1].split(':')[1])+1}`);
            text.push('=====');
            for(let item in itemsData) {
                if(itemsData[item].category !== category.id) continue;
                text.push(`${itemsData[item].name} ${itemsData[item].size || ''}`);
                text.push(`${itemsData[item].count}`);
            }
            text.push(`cut`);

            
        });
        console.log(text);
        this.printOrderLines(text);

    }

    printOrderLines(textArr) {
        const networkDevice = new escpos.Network(process.env.PRINTER_IP, parseInt(process.env.PRINTER_PORT));
        const printer = new escpos.Printer(networkDevice);
        networkDevice.open(function(error){
            textArr.forEach(text => {
                if(text=='cut') {
                    printer.cut();
                    return;
                }
                printer
                .font('B')
                .size(1, 1)
                .text(text, 'CP866');
            });

            printer.cut().beep(3, 100).close();
          });
    }
}
module.exports = Printer;