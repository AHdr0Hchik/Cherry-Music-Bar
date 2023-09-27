
const url = "../json/thing.json";



function lotDescription() {
    $.getJSON(url, function (data) {
        for (let i = 0; i<data.length; i++) {
            $(document).on("click", `#name-${i}`, function (e) {
                $('body').append('<div class = "lot-info" id = "lot-info"><div class="lot-info-body"><button onclick="lotClose()" class="lot-info-close">Х</button><img class="lot-info-img" id="lot-img-'+data[i].id+'" src=".'+data[i].imgUrl+'" alt=""><div class="lot-info-text"><p class="lot-info-name fz36ffMain" id="lot-name-'+data[i].id+'">'+data[i].name+'</p><p class="lot-info-description" id="lot-description-'+data[i].id+'">'+data[i].description+'</p><p class="lot-info-price fz36ffMain" id="lot-price-'+data[i].id+'">'+data[i].price+' Р</p><button class="btn-add-to-cart fz36ffMain">В корзину</button></div></div></div>');
            });
            break;
        }


    });
}
$.getJSON(url, function (data) {
    console.log(data);

    for(let i = 0; i<data.length;i++) {
        $('.menu').append('<a onclick="lotDescription()" class="category" id=""><img src=".'+data[i].imgUrl+'" alt="123"><div class="descCategory"><p id="name-'+i+'">'+data[i].name+'</p></div></a>')
    }
});


$(document).on("click", "#name-0", function (e) {
    const id = $(".category:last-child").attr('id');
    console.log(id);
});