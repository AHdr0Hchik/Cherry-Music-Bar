const Database = require('./Database');
const Model = require('../models');

class Order {
    constructor(orderLineArray, address, numberPhone, sale) {
        this.orderLineArray = orderLineArray,
        this.orderDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
        this.sale = sale || 0,
        this.address = address || '',
        this.numberPhone = numberPhone || ''
    }
    guests_count;
    id;
    description = '';
    sum = 0;
    sumWithSale = 0;
    agentId = -1;
    pos = 'site';

    //getters and setters
    Id(id) {
        if(!id) return this.id;
        else this.id = id;
    }

    Pos(pos) {
        if(!pos) return this.pos;
        else this.pos = pos;
    }

    Guests_count(guests_count) {
        if(!guests_count) return this.guests_count;
        else this.guests_count = guests_count;
    }

    AgentId(agentId) {
        if(!agentId) return this.agentId;
        else this.agentId = agentId;
    }

    OrderLineArray(orderLineArray) {
        if(!orderLineArray) return this.orderLineArray;
        else this.orderLineArray = orderLineArray;
    }
    OrderDate(orderDate) {
        if(!orderDate) return this.orderDate;
        else this.orderDate = orderDate;
    }
    Sale(sale) {
        if(!sale) return this.sale;
        else this.sale = sale;
    }
    Description(description) {
        if(!description) return this.description;
        else this.description = description;
    }

    //operations with order line list
    async addOrderLine(orderLine) {
        try {
            return this.orderLineArray.push(orderLine);
        } catch(e) {
            return false;
        }
    }

    async removeOrderLine() {
        try {
            return this.orderLineArray.pop();
        } catch(e) {
            return false;
        }
    }

    //common events
    async calculateTotalCost() {
        try {
            let sum=0.00;
            this.orderLineArray.forEach(orderLine => {
                sum += orderLine.count * orderLine.price;
            });
            this.sum = sum
            this.sumWithSale = (this.sum - this.sum * this.sale/100).toFixed(2);
            return {sum: this.sum, sumWithSale: this.sumWithSale};
        } catch(e) {
            console.log(e);
            return false;
        }
    }

    
    
    async findOfficialLines() {
        try {
            console.log('start');
            let official_orderLineArray = [];
            const official_items = await Model.menu.findAll({
                where: {
                    is_official : 1
                }
            });
            console.log(official_items);
            for(let i=0; i<this.orderLineArray.length; i++) {
                const item = await Model.menu.findOne({
                    where: {
                        id: parseInt(this.orderLineArray[i].id)
                    }
                });
                console.log(item);
                if (official_items.some(officialItem => officialItem.id === item.id)) {
                    official_orderLineArray.push(this.orderLineArray[i]);
                }
            };
            return official_orderLineArray;

        } catch(e) {
            console.log(e);
            return false;
        }
    }

    //handler funcs

    applyDiscounts(menuItems, sales) {
        this.orderLineArray = this.orderLineArray.map(orderline => {
          const menuItem = menuItems.find(item => item.id == orderline.id);
          const matchingSales = sales.filter(sale => {
            switch (sale.target_type) {
              case 'orderline':
                return orderline.id === sale.target_id;
              case 'subcategory':
                return menuItem.subcategory === sale.target_id;
              case 'category':
                return menuItem.category === sale.target_id;
              default:
                return false;
            }
        });
      
        let maxDiscount = 1;
        matchingSales.forEach(sale => {
            console.log(`Скидка применена к ${orderline.name}`);
            const discount = 1 - sale.sale / 100;
            if (discount < maxDiscount) {
                maxDiscount = discount;
            }
        });

        let updatedPrice = orderline.price * maxDiscount;
          return { ...orderline, price: updatedPrice };
        });
        this.calculateTotalCost();
    }

    async createOrder() {
        try {
            const db = new Database;
            await db.connection.promise().query('INSERT INTO history (orderLineArray, sum, sale, sumWithSale, orderDate, description, pos, agentId, deliveryAddress, clientPhone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [JSON.stringify(this.orderLineArray), this.sum, this.sale, this.sumWithSale, this.orderDate, this.description, this.pos, this.agentId, this.address, this.numberPhone]);
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    }

    async updateOrder() {
        try {
            const db = new Database;
            await db.connection.promise().query('UPDATE history SET orderLineArray=?, sum=?, sale=?, sumWithSale=?, orderDate=?, description=?, pos=?, agentId=?, deliveryAddress=?, clientPhone=? WHERE id=?;', [JSON.stringify(this.orderLineArray), this.sum, this.sale, this.sumWithSale, this.orderDate, this.description, this.pos, this.agentId, this.address, this.numberPhone, this.id]);
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    }

    async updateOrderLineArray(new_orderLineArray) {
        try {
            const db = new Database;
            // Перебираем элементы из new_orderLineArray
            new_orderLineArray.forEach(item => {
                // Проверяем, есть ли элемент с таким же id и size в this.orderLineArray
                const existingItem = this.orderLineArray.find(orderItem => orderItem.id === item.id && orderItem.size === item.size);
                if (existingItem) {
                  // Если элемент уже существует, суммируем значения count
                  existingItem.count += item.count;
                } else {
                  // Если элемент не существует, добавляем его в this.orderLineArray
                  this.orderLineArray.push({ id: item.id, name: item.name, price: item.price, count: item.count, size: item.size });
                }
            });
            await this.calculateTotalCost();

            await db.connection.promise().query('UPDATE History SET orderLineArray=?, sum=?, sale=?, sumWithSale=? where id=?', [JSON.stringify(this.orderLineArray), this.sum, this.sale, this.sumWithSale, this.id]);
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    }

    async findOrderByPos() {
        try {
            const db = new Database;
            const order = await Model.history.findOne({
                where: {
                    pos: this.pos,
                    isComplete: 0
                }
            })
            //const [order] = await db.connection.promise().query('SELECT * FROM History WHERE pos=? AND isComplete=0', [this.pos]);
            if(!order) {
                return false;
            }
            const {id, orderLineArray, sum, sale, sumWithSale, agentId, guests_count} = order;
            this.id = id;
            this.orderLineArray = JSON.parse(orderLineArray);
            this.sum = sum;
            this.sale = sale;
            this.sumWithSale = sumWithSale;
            this.agentId = agentId;
            this.guests_count = guests_count;
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    }

    async findOrderById() {
        try {
            const db = new Database;
            const order = await Model.history.findOne({
                where: {
                    id: this.id,
                    isComplete: 0
                }
            })
            //const [order] = await db.connection.promise().query('SELECT * FROM History WHERE id=? AND isComplete=0', [this.id]);
            if(!order) {
                return false;
            }
            const {pos, orderLineArray, sum, sale, sumWithSale, agentId, guests_count} = order;
            this.orderLineArray = JSON.parse(orderLineArray);
            this.sum = sum;
            this.pos = pos;
            this.sale = sale;
            this.sumWithSale = sumWithSale;
            this.agentId = agentId;
            this.guests_count = guests_count;
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    }

    async isComplete() {
        try {
            await Model.history.update(
                {
                    isComplete: 1
                },
                {
                    where: {
                        id: this.id
                    }
                }
            )
            //await new Database().connection.promise().query('UPDATE History SET isComplete=1 WHERE id=?', [this.id]);
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
        
    }
}

module.exports = Order;