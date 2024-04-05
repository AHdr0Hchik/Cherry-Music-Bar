const subcategory = document.getElementById('subcat');
const pizzaPrices = document.getElementById('pizza-price');
const otherPrices = document.getElementById('prices');

subcategory.addEventListener("change", function (evt) {
    if(this.value == 11) {
        pizzaPrices.classList.remove('none');
        otherPrices.classList.add('none');
        
    } else {
        pizzaPrices.classList.add('none');
        otherPrices.classList.remove('none');
    }
}, false);