

function readJSON() {
    const fs = require("fs");
    fs.readFile('../json/thing.js', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        const obj = JSON.parse(data);
        return obj;
    });
}
/*function htmlGenerator(subcategory) {
    const subcat_descript = {
        'pizza': 'Пицца',
        'rolls': 'Ролл',
        'khachapuri' : 'Хачапури',
        'sbor_pizza' : 'Сборная пицца',
        'sets' : 'Сет роллов',
        'gunkans' : 'Гункан',
        'japan_burger' : 'Японский бургер',
        'starters' : 'Первое блюдо',
        'main_dishes' : 'Второе блюдо',
        'hot_appetizers' : 'Горячая закуска',
        'cold_platter' : 'Холодная закуска',
        'side_dishes' : 'Гарниры',
        'desserts' : 'Десерты',
        'burgers' : 'Бургеры',
    }[subcategory];
    const el = document.getElementById('menu');
    for(let i = 1; i<=3; i++) {
        const elChild = document.createElement("div");
        elChild.innerHTML = '<a onclick="lotDescription()" class="category" id=""><img src="../jpgs/dishes/'+subcategory+'.jpg" alt="123"><div class="descCategory"><p>123</p></div></a>';
        el.appendChild(elChild);

    };
    cartGenerate();
}

*/

function lotDescription() {
    const el = document.body;
    const elChild = document.createElement("div");
    elChild.className = 'lot-info';
    elChild.id = 'lot-info';
    elChild.innerHTML = '<div class="lot-info-body"><button onclick="lotClose()" class="lot-info-close">Х</button><img class="lot-info-img" id="lot-img" src="/jpgs/dishes/pizzas.jpg" alt=""><div class="lot-info-text"><p class="lot-info-name fz36ffMain" id="lot-name">Пицца баварская</p><p class="lot-info-description" id="lot-description">Вкуснейшая пицца с грибами, помидорами баварскими колбасками и сыром</p><p class="lot-info-price fz36ffMain" id="lot-price">500 Р</p><button class="btn-add-to-cart fz36ffMain">В корзину</button></div></div>';
    el.appendChild(elChild);
}
function lotClose() {
    document.getElementById("lot-info").remove();

}

function cartGenerate() {
    const el = document.body;
    const elChild = document.createElement("button");
    elChild.className = 'btn-cart';
    elChild.id = 'btn_cart';
    elChild.innerHTML = '<img src="../jpgs/ui/cart.svg" alt="" class="cart-img">';
    el.appendChild(elChild);
}




