
const url = "../json/thing.json";

$.getJSON(url, function (data) {
    console.log(data);

    for(let i = 0; i<data.length;i++) {
        $('#products-container').append('<div class="col-md-6">\n' +
            '                    <div class="card mb-4" data-id="'+data[i].id+'">\n' +
            '                        <img class="product-img" src=".'+data[i].imgUrl+'" alt="">\n' +
            '                        <div class="card-body text-center">\n' +
            '                            <h4 class="item-title">'+data[i].name+'</h4>\n' +
            '                            <div class="details-wrapper">\n' +
            '                                <div class="items counter-wrapper">\n' +
            '                                    <div class="items__control" data-action="minus">-</div>\n' +
            '                                    <div class="items__current" data-counter>1</div>\n' +
            '                                    <div class="items__control" data-action="plus">+</div>\n' +
            '                                </div>\n' +
            '\n' +
            '                                <div class="price">\n' +
            '                                    <div class="price__currency">'+data[i].price+' ₽</div>\n' +
            '                                </div>\n' +
            '                            </div>\n' +
            '\n' +
            '                            <button data-cart type="button" class="btn btn-block btn-outline-warning">+ в корзину</button>\n' +
            '\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>')
    }
});



$(document).ready(function() {
    $(document).on("click", ".category", function() {
        const current_id = parseInt(this.id)-1;
        const id = parseInt(this.id);
        $.getJSON(url, function (data) {
            if (!$('.lot-info').length) {
                $('body').append('<div class="lot-info" id="lot-info">\n' +
                    '    <div class="lot-info-body" data-id="'+id+'">\n' +
                    '        <button class="lot-info-close" id="desc_close">Х</button>\n' +
                    '        <img class="lot-info-img" id="" src=".'+data[current_id].imgUrl+'" alt="">\n' +
                    '        <div class="lot-info-text">\n' +
                    '            <p class="lot-info-name fz36ffMain">'+data[current_id].name+'</p>\n' +
                    '            <p class="lot-info-description" id="\'">'+data[current_id].description+'</p>\n' +
                    '            <div class="counter counter-wrapper">\n' +
                    '                <button data-action="minus">-</button>\n' +
                    '                <p data-counter>1</p>\n' +
                    '                <button data-action="plus">+</button>\n' +
                    '            </div>\n' +
                    '            <p class="lot-info-price fz36ffMain" id="">'+data[current_id].price+' ₽</p>\n' +
                    '            <button class="btn-add-to-cart fz36ffMain" data-cart>В корзину</button>\n' +
                    '        </div>\n' +
                    '    </div>\n' +
                    '</div>');
            }
            else {
                $( "#lot-info" ).remove();
                $('body').append('<div class = "lot-info" id = "lot-info"><div class="lot-info-body"><button class="lot-info-close" id="desc_close">Х</button><img class="lot-info-img" id="lot-img-'+data[current_id].id+'" src=".'+data[current_id].imgUrl+'" alt=""><div class="lot-info-text"><p class="lot-info-name fz36ffMain" id="lot-name-'+data[current_id].id+'">'+data[current_id].name+'</p><p class="lot-info-description" id="lot-description-'+data[current_id].id+'">'+data[current_id].description+'</p><p class="lot-info-price fz36ffMain" id="lot-price-'+data[current_id].id+'">'+data[current_id].price+' Р</p><form action="/add-to-cart" method="get"><button class="btn-add-to-cart fz36ffMain" value="'+id+'" name="add">В корзину</button></form></div></div></div>');
            }
        });
    });
    $(document).on("click", "#desc_close", function() {
        $( "#lot-info" ).remove();
    });
});
