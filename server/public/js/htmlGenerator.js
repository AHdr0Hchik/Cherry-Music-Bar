
function htmlGenerator(subcategory) {
    const subcat_descript = {
        'pizzas': 'Пицца',
        'rolls': 'Ролл',
        'khachapuri' : 'Хачапури',
        'sbor_pizza' : 'Сборная пицца'
    }[subcategory]

    const el = document.getElementById('menu');
    for(let i = 1; i<=8; i++) {

        const elChild = document.createElement("div");
        elChild.innerHTML = '<a href="#" class="category" id=""><img src="../jpgs/dishes/'+subcategory+'.jpg" alt="123"><div class="descCategory"><p>'+ subcat_descript + ' '+ i +'</p></div></a>';
        el.appendChild(elChild);
    };





}


