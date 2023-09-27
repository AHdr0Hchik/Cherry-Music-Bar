

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




