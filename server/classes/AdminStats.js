const Model = require('../models')
const Database = require('./Database');

class AdminStats {

    db = new Database;

    async getDto() {
        const categories = await Model.categories.findAll({
            attributes: ['id', 'category_name']
        });
        const subcategories = await Model.subcategories.findAll({
            attributes: ['id', 'category', 'subcategory_name']
        })
        return subcategories.map(subcategory => {
            const category = categories.find(cat => cat.id === subcategory.category);
            return {
            subcategory_id: subcategory.id,
            subcategory_name: subcategory.subcategory_name,
            category_name: category ? category.category_name : "" // Проверка наличия категории
            };
        });
    }

    async getOrderHistory(date_start, date_finish) {
        const history = await Model.history.findAll({
            where: {
                orderDate: { [Model.Op.gte]: date_start },
                orderDate: { [Model.Op.lte]: date_finish }
            }
        })
        //const [history] = await this.db.connection.promise().query('SELECT * FROM history where orderDate>=? and orderDate <=?', [date_start, date_finish]);
        const menu = await Model.menu.findAll({
            where: {
                attributes: ['id', 'name']
            }
        })
        //const [menu] = await this.db.connection.promise().query('SELECT id, name FROM menu');
        if(!history) {
            return false;
        }
        history.forEach(order => {
            order.orderDate = order.orderDate.toISOString().slice(0, 19).replace('T', ' ');
            order.orderLineArray = JSON.parse(order.orderLineArray);
            order.orderLineArray.forEach(orderLine => {
              const orderLineId = orderLine.id;
              const dish = menu.find(dish => dish.id == orderLineId);
            
              if (dish) {
                orderLine.name = dish.name;
              }
            });
        });
        return history;
    }

    async getDishHistory(date_start, date_finish) {
        const history = await this.getOrderHistory(date_start, date_finish);
        console.log(history);
        if(!history) {
            return false;
        }
        const salesInfo = {};

        history.forEach(order => {
            const discountedPrice = 1 - order.sale/100;
            order.orderLineArray.forEach(item => {
                const key = item.id + (item.size || ''); // Добавляем размер к ключу, если он есть
                
                if (salesInfo[key]) {
                    salesInfo[key].totalSales += item.count;

                    salesInfo[key].sum += item.count * item.price;
                    salesInfo[key].sumWithSale += (item.count * item.price * discountedPrice);
                } else {
                    salesInfo[key] = {
                        id: item.id,
                        name: item.name + ' '+ (item.size || '') ,
                        totalSales: item.count,
                        price: item.price,
                        sum: item.count * item.price,
                        sumWithSale: item.count * item.price * discountedPrice
                    };
                }
            });
        });
        
        const salesArray = Object.values(salesInfo);
        
        return salesArray;
    }
}
module.exports = AdminStats;