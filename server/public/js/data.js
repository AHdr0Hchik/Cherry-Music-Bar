
const url = "../json/thing.json";

$.getJSON(url, function (data) {
    const loc = window.location.pathname;
    const dir = loc.split("/").pop();

    for(let i = 0; i<data.length;i++) {
        const backSide = `<div class="card mb-4 back none" data-id="${dir} ${data[i].id}">
                            <div class="card-body text-center">
                                <h4 class="item-title">${data[i].name}</h4>
                                <h5 class="item-desc">${data[i].description}</h5>
                                <button data-anim type="button" class="btn btn-block btn-outline-warning">назад</button>
                            </div>
                        </div>`
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

