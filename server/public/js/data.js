
const url_thing = "../json/thing.json";
const url_order = "../json/order.json"

$.getJSON(url_thing, function (data) {
    const loc = window.location.pathname;
    const dir = loc.split("/").pop();

    for(let i = 0; i<data.length;i++) {
        if(dir != 'pizza') {
            $('#products-container').append('<div class="col-md-6">\n' +
                '                    <div class="card mb-4 front" data-id="'+dir+ ' ' + data[i].id + '">\n' +
                '                        <img class="product-img" src=".' + data[i].imgUrl + '" alt="">\n' +
                '                        <div class="card-body text-center">\n' +
                '                            <h4 class="item-title">' + data[i].name + '</h4>\n' +
                '                            <div class="details-wrapper">\n' +
                '                                <div class="items counter-wrapper">\n' +
                '                                    <div class="items__control" data-action="minus">-</div>\n' +
                '                                    <div class="items__current" data-counter>1</div>\n' +
                '                                    <div class="items__control" data-action="plus">+</div>\n' +
                '                                </div>\n' +
                '\n' +
                '                                <div class="price">\n' +
                '                                    <div class="price__currency">' + data[i].price + ' ₽</div>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '\n' +
                '                            <button data-cart type="button" class="btn btn-block btn-outline-warning">+ в корзину</button>\n' +
                '\n' + '<button data-anim type="button" class="btn btn-block btn-outline-warning" style="margin-left: 20px">к описанию</button>' +
                '                        </div>\n' +
                '                    </div>\n' +
                `<div class="card mb-4 back none" data-id="${dir} ${data[i].id}">
                            <div class="card-body text-center">
                                <h4 class="item-title">${data[i].name}</h4>
                                <h5 class="item-desc">${data[i].description}</h5>
                                <button data-anim type="button" class="btn btn-block btn-outline-warning">назад</button>
                            </div>
                </div>` +
                '                </div>')
        }
        else {
            $('#products-container').append('<div class="col-md-6">\n' +
                '                    <div class="card mb-4 front" data-id="'+dir+ ' ' + data[i].id + '">\n' +
                '                        <img class="product-img" src=".'+data[i].imgUrl+'" alt="">\n' +
                '                        <div class="card-body text-center">\n' +
                '                            <h4 class="item-title">'+data[i].name+'</h4>\n' +
                '                            <div class="details-wrapper">\n' +
                '                                <div class="items counter-wrapper">\n' +
                '                                    <div class="items__control" data-action="minus">-</div>\n' +
                '                                    <div class="items__current" data-counter>1</div>\n' +
                '                                    <div class="items__control" data-action="plus">+</div>\n' +
                '                                </div>\n' +
                                                '<div class="items size-wrapper">\n' +
                                                    '<div class="items__control active" data-action="pizza" data-sb-curent-price="'+data[i].price30+'" data-sb-curent-size="30" data-sb-curent-id-or-vendor-code="0030pz">30\n</div>' +
                                                    '<div class="items__control" data-action="pizza" data-sb-curent-price="'+data[i].price36+'" data-sb-curent-size="36" data-sb-curent-id-or-vendor-code="0036pz">36\n</div>' +
                                                    '<div class="items__control" data-action="pizza" data-sb-curent-price="'+data[i].price50+'" data-sb-curent-size="50" data-sb-curent-id-or-vendor-code="0050pz">50\n</div>' +
                                                '</div>\n' +

                '                                <div class="price">\n' +
                '                                    <div class="price__currency">'+data[i].price30+' ₽</div>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '\n' +
                '                            <button data-cart type="button" class="btn btn-block btn-outline-warning">+ в корзину</button>\n' +
                '\n' + '<button data-anim type="button" class="btn btn-block btn-outline-warning" style="margin-left: 20px">к описанию</button>' +
                '                        </div>\n' +
                '                    </div>\n' +
                `<div class="card mb-4 back none" data-id="${dir} ${data[i].id}">
                            <div class="card-body text-center">
                                <h4 class="item-title">${data[i].name}</h4>
                                <h5 class="item-desc">${data[i].description}</h5>
                                <button data-anim type="button" class="btn btn-block btn-outline-warning">назад</button>
                            </div>
                </div>` +
                '                </div>')
        }

    }
});

$.getJSON(url_order, function (data) {
    let info = [];
    let sum = 0;
    for(let i=0; i<data.length; i++) {
        if(data[i].size!==null) {
            info += data[i].name + `(${data[i].count} шт, ${data[i].size} см), `;
        }

        sum += data[i].price * data[i].count;
    }
    const str = `<tr>
                    <td></td>
                    <td>${info}</td>
                    <td>${sum} ₽</td>
                    <td class="table-success"><button>Принять</button></td>
                    <td class="table-danger"><button>Отклонить</button></td>
                </tr>`;
    document.querySelector('.table').insertAdjacentHTML('beforeend', str);
});

