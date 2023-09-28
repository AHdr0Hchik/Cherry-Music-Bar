
const url = "../json/thing.json";

$.getJSON(url, function (data) {
    console.log(data);

    for(let i = 0; i<data.length;i++) {
        $('.menu').append('<a class="category" id="'+data[i].id+'"><img src=".'+data[i].imgUrl+'" alt="123"><div class="descCategory"><p id="name-'+i+'">'+data[i].name+'</p></div></a>')
    }
});



$(document).ready(function() {
    $(document).on("click", ".category", function() {
        const current_id = parseInt(this.id)-1;
        $.getJSON(url, function (data) {
            $('body').append('<div class = "lot-info" id = "lot-info"><div class="lot-info-body"><button class="lot-info-close" id="desc_close">Х</button><img class="lot-info-img" id="lot-img-'+data[current_id].id+'" src=".'+data[current_id].imgUrl+'" alt=""><div class="lot-info-text"><p class="lot-info-name fz36ffMain" id="lot-name-'+data[current_id].id+'">'+data[current_id].name+'</p><p class="lot-info-description" id="lot-description-'+data[current_id].id+'">'+data[current_id].description+'</p><p class="lot-info-price fz36ffMain" id="lot-price-'+data[current_id].id+'">'+data[current_id].price+' Р</p><button class="btn-add-to-cart fz36ffMain">В корзину</button></div></div></div>');
        });
    });
    $(document).on("click", "#desc_close", function() {
        $( "#lot-info" ).remove();
    });
    $('body').append('<button class="btn-cart" id="btn_cart" ><img src="../jpgs/ui/cart.svg" alt="" class="cart-img"></button>');
});






