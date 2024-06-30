const Model = require('../models');
const escpos = require('escpos');
const OrderLine = require('./OrderLine');
escpos.Network = require('escpos-network');
escpos.USB = require('escpos-usb');
escpos.Serial = require('escpos-serialport');

const {Printer: escPrinter} = require('@node-escpos/core')

const Network = require('@node-escpos/network-adapter');

const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require('node-thermal-printer').types;

class Printer {
    constructor() {
        
    }


    async printOrder(order, final, agent) {
        console.log(order);
        const pos = await Model.pos.findOne({
            attributes: ['printer'],
            where: {id: parseInt(order.pos.split(':')[0])}
        });
        console.log(pos);

        const printer = new ThermalPrinter({
            type: PrinterTypes.EPSON,
            interface: `tcp://${pos.printer.split('###')[2].split(':')[0]}:9100`
        });

        printer.alignCenter();
        printer.setTypeFontA();
        printer.setTextSize(1, 1); // Увеличиваем размер шрифта
        printer.println(process.env.ORG_NAME);
        printer.setTextSize(0, 0);
        printer.alignLeft();
        printer.println(process.env.ORG_PHONE_NUMBER);
        printer.println(`Когда: ${order.orderDate}`);
        printer.println(`Обслужил: ${agent}`);
        printer.drawLine();

        // Печать заголовка таблицы
        printer.tableCustom([
        { text: 'Заказ', align: 'LEFT', width: 0.5, bold: true },
        { text: 'Цена', align: 'RIGHT', width: 0.15, bold: true },
        { text: 'Кол', align: 'RIGHT', width: 0.1, bold: true },
        { text: 'Сумма', align: 'RIGHT', width: 0.2, bold: true }
        ]);
        printer.drawLine();

        // Печать строк заказа
        order.orderLineArray.forEach(orderLine => {
        printer.tableCustom([
            { text: `${orderLine.name} ${orderLine.size || ''}`, align: 'LEFT', width: 0.5 },
            { text: `${orderLine.price} Р`, align: 'RIGHT', width: 0.15 },
            { text: `${orderLine.count}`, align: 'RIGHT', width: 0.1 },
            { text: `${orderLine.count * orderLine.price} Р`, align: 'RIGHT', width: 0.2 }
        ]);
        printer.drawLine();
        });

        // Печать итоговой суммы
        const totalText = `Сумма: ${order.sale == 0 ? order.sumWithSale + ' Р' : (order.sum + '-' + (order.sum - order.sumWithSale) + '=' + order.sumWithSale + ' Р')}`;
        const finalText = final ? 'Приходите ещё :)' : 'Приятного аппетита :)';

        printer.setTextSize(1, 1);
        printer.println(totalText);
        printer.setTextSize(1, 1);
        printer.bold(true);
        printer.println(finalText);
        printer.newLine();
        printer.newLine();
        
        // Завершение и отрезка бумаги
        printer.cut();
        await printer.execute();
        console.log('Receipt printed successfully.');
        /*const device = new Network('192.168.1.213', 9100);

        device.open(async function(err){
            if(err){
                console.log(err)
              // handle error
              return false
            }
          
            const options = { encoding: "GB18030"}
            const printer = new escPrinter(device, options);

            printer
                .font('A')
                .size(0.3, 0.3)
                .align('ct')
                .text(process.env.ORG_NAME, 'CP866')
                .align('lt')
                .text(process.env.ORG_PHONE_NUMBER, 'CP866')
                .text('Когда: ' + order.orderDate, 'CP866')
                .text('Обслужил: ' + order.agentId, 'CP866')
                .newLine()
                .align('ct');

            // Печать заголовка таблицы
            printer.tableCustom([
                { text: 'Заказ', width: 0.7, style: 'B'},
                { text: 'Цена', width: 0.15, style: 'B', align: 'RIGHT' },
                { text: 'Кол', width: 0.1, style: 'B', align: 'RIGHT' },
                { text: 'Сумма', width: 0.15, style: 'B', align: 'RIGHT' }
            ], { encoding: 'CP866', size: [0.5, 0.5] });
            printer.text('-'.repeat(48)); // Разделительная линия

            // Печать строк заказа
            order.orderLineArray.forEach(orderLine => {
                printer.align('CT').tableCustom([
                { text: `${orderLine.name} ${orderLine.size || ''}`, width: 0.7},
                { text: `${orderLine.price} Р`, width: 0.15, align: 'RIGHT' },
                { text: `${orderLine.count}`, width: 0.1, align: 'RIGHT' },
                { text: `${orderLine.count * orderLine.price} Р`, width: 0.15, align: 'RIGHT' }
                ], { encoding: 'CP866', size: [0.5, 0.5] });
                printer.text('-'.repeat(48)); // Разделительная линия
            });
            const totalText = `Сумма: ${order.sale == 0 ? order.sumWithSale + ' Р' : (order.sum + '-' + (order.sum - order.sumWithSale) + '=' + order.sumWithSale + ' Р')}`;
            const finalText = final ? 'Приходите ещё :)' : 'Приятного аппетита :)';

            printer
                .size(1, 1)
                .align('lt')
                .text(totalText, 'CP866')
                .size(1, 1)
                .align('lt')
                .style('b')
                .text(finalText, 'CP866')
                .newLine()
                .newLine()
                .cut()
                .close();
                */
          /*
            printer
            .font('A')
            .size(0.3, 0.3)
            .align('ct')
            .text(process.env.ORG_NAME, 'CP866')
            .align('lt')
            .text(process.env.ORG_PHONE_NUMBER, 'CP866')
            .text('Когда: ' + order.orderDate, 'CP866')
            .text('Обслужил: ' + order.agentId, 'CP866')
            .newLine()
            printer.align('ct');
            printer.tableCustom([{text: `Заказ`, width: 0.65, style: 'B'},{text: '|', width: 0.05, style: 'B'}, {text: `Цена`, width: 0.15, style: 'B'},{text: '|', width: 0.05, style: 'B'}, {text:`Кол`, width: 0.1, style: 'B'}, {text: `|`, width: 0.05, style: 'B'}, {text:`Сумма`, width: 0.2, style: 'B'}], { encoding: 'CP866', size: [1, 1] });
            order.orderLineArray.forEach(orderLine => {
                printer.align('ct');
                printer.tableCustom([{text: `${orderLine.name} ${orderLine.size || ''}`, width: 0.65, style: 'B'},{text: '|', width: 0.05, style: 'B'}, {text: `${orderLine.price} Р`, width: 0.15, style: 'B'},{text: '|', width: 0.05, style: 'B'}, {text:`${orderLine.count}`, width: 0.1, style: 'B'}, {text: `|`, width: 0.05, style: 'B'}, {text:`${orderLine.count * orderLine.price} Р`, width: 0.2, style: 'B'}], { encoding: 'CP866', size: [1, 1] });
                printer.newLine();
            });
            if(final) {
				printer.size(1, 1).align('lt').text(`Сумма: ${ (order.sale == 0 ? order.sumWithSale+' Р' : (order.sum + '-' + order.sum-order.sumWithSale + '=' + order.sumWithSale + ' Р'))}`, 'CP866');
				printer.size(1, 1).align('LT').style('b').text('Приходите ещё :)', 'CP866')
				.newLine()
				.newLine()
            .cut()
            .close();
            } else {
				printer.size(1, 1).align('LT').style(false, true, false).text(`Предаварительно: ${ (order.sale == 0 ? order.sumWithSale+' Р' : (order.sum + '-' + order.sum-order.sumWithSale + '=' + order.sumWithSale + ' Р'))}`, 'CP866');
				printer.size(1, 1).align('LT').style(true, false, false).text('Приятного аппетита :)', 'CP866')
				.newLine()
				.newLine()
            .cut()
            .close();
            }
        });*/

        /*
        const device = new escpos.Network('192.168.1.213', 9100);
        const printer = new escpos.Printer(device);

        device.open(function(error){
            printer
            .font('A')
            .size(0.5, 0.5)
            .align('CT')
            .text(process.env.ORG_NAME, 'CP866')
            .align('LT')
            .text(process.env.ORG_PHONE_NUMBER, 'CP866')
            .text('Когда: ' + order.orderDate, 'CP866')
            .text('Обслужил: ' + order.agentId, 'CP866')
            .newLine()
            printer.tableCustom([{text: `Заказ`, width: 0.65, style: 'B'},{text: '|', width: 0.05, style: 'B'}, {text: `Цена`, width: 0.15, style: 'B'},{text: '|', width: 0.05, style: 'B'}, {text:`Кол`, width: 0.1, style: 'B'}, {text: `|`, width: 0.05, style: 'B'}, {text:`Сумма`, width: 0.2, style: 'B'}], { encoding: 'CP866', size: [1, 1] });
            let orderLineArray_formatted;
            order.orderLineArray.forEach(orderLine => {
                printer.align('CT');
                printer.tableCustom([{text: `${orderLine.name} ${orderLine.size || ''}`, width: 0.65, style: 'B'},{text: '|', width: 0.05, style: 'B'}, {text: `${orderLine.price} Р`, width: 0.15, style: 'B'},{text: '|', width: 0.05, style: 'B'}, {text:`${orderLine.count}`, width: 0.1, style: 'B'}, {text: `|`, width: 0.05, style: 'B'}, {text:`${orderLine.count * orderLine.price} Р`, width: 0.2, style: 'B'}], { encoding: 'CP866', size: [1, 1] });
                printer.newLine();
            });
            if(final) {
				printer.size(1, 1).align('LT').text(`Сумма: ${ (order.sale == 0 ? order.sumWithSale+' Р' : (order.sum + '-' + order.sum-order.sumWithSale + '=' + order.sumWithSale + ' Р'))}`, 'CP866');
				printer.size(1, 1).align('LT').style('b').text('Приходите ещё :)', 'CP866')
				.newLine()
				.newLine()
            .cut()
            .close();
            } else {
				printer.size(1, 1).align('LT').style('I').text(`Предаварительно: ${ (order.sale == 0 ? order.sumWithSale+' Р' : (order.sum + '-' + order.sum-order.sumWithSale + '=' + order.sumWithSale + ' Р'))}`, 'CP866');
				printer.size(1, 1).align('LT').style('B').text('Приятного аппетита :)', 'CP866')
				.newLine()
				.newLine()
            .cut()
            .close();
            }
        });
        */
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
            text.push(`Время: ${new Date().toLocaleString('ru-RU')}`);
            text.push(`Пробил: ${agent.firstname}`);
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
        const networkDevice = new escpos.Network(printer_ip, 9100);
        const printer = new escpos.Printer(networkDevice);
        networkDevice.open(function(error){
            if(error) {
                return console.log(error);
            }
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