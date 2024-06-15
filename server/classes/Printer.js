const Model = require('../models');
const escpos = require('escpos');
const OrderLine = require('./OrderLine');
escpos.Network = require('escpos-network');

class Printer {
    constructor() {
        
    }

    printOrder(order, final) {
        console.log(order + ' ' + final)
        const networkDevice = new escpos.Network('192.168.1.4', 9100);
        const printer = new escpos.Printer(networkDevice);
        networkDevice.open(function(error){
            printer
            .font('A')
            .size(0.5, 0.5)
            .align('CT')
            .text(process.env.ORG_NAME, 'CP866')
            .align('LT')
            .text('Где: ' + order.pos , 'CP866')
            .text('Когда: ' + order.orderDate , 'CP866')
            .text('Обслужил: ' + order.agentId, 'CP866')
            .newLine()
            .close();
            let orderLineArray_formatted;
            order.orderLineArray.forEach(orderLine => {
                printer.align('CT');
                printer.tableCustom([{text: `${orderLine.name} ${orderLine.size || ''}`, width: 0.7, style: 'B'},{text: `|`, width: 0.05, style: 'B'}, {text: `${orderLine.price} Р`, width: 0.15, style: 'B'},{text: `|`, width: 0.05, style: 'B'}, {text:`${orderLine.count}`, width: 0.1, style: 'B'}, {text: `|`, width: 0.05, style: 'B'},  {text:`${orderLine.count * orderLine.price} Р`, width: 0.2, style: 'B'}], { encoding: 'CP866', size: [1, 1] });
            })
            printer.newLine();
            printer.align('LT').text(`Сумма: ${ (order.sale == 0 ? order.sumWithSale+' Р' : (order.sum + '-' + order.sum-order.sumWithSale + '=' + order.sumWithSale + ' Р'))}`, 'CP866');
            if(final) {
            printer.align('LT').style('b').text('Приходите ещё :)', 'CP866')
            .cut()
            .close();
            } else {
                printer.align('LT').style('b').text('Приятного аппетита :)', 'CP866')
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
        let details = {};
        categoriesInfo.forEach(category => {
            details.printer_ip = category.printer.split('###')[2].split(':')[0];
            text.push(`Отдел: ${category.category_name}`);
            text.push(`ВРемя: ${new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()}`);
            text.push(`ПРобил: ${agent.firstname}`);
            text.push(`Для: ${pos.name}:${parseInt(orderDetails.split('_')[1].split(':')[1])+1}`);
            text.push('=====');
            for(let item in itemsData) {
                if(itemsData[item].category !== category.id) continue;
                text.push(`${itemsData[item].name} ${itemsData[item].size || ''}`);
                text.push(`${itemsData[item].count}`);
            }
            text.push(`cut`);
            this.printOrderLines(text, details.printer_ip);
            text = [];
            
        });

    }

    printOrderLines(textArr, printer_ip) {
        console.log(printer_ip);
        const networkDevice = new escpos.Network('192.168.1.4', 9100);
        const printer = new escpos.Printer(networkDevice);
        networkDevice.open(function(error){
            console.log(error);
            console.log(textArr);
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