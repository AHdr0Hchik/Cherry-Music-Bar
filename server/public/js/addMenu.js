class someLot {
    nameLot; descLot; priceLot; categoryLot;

    setParams(name, desc, price, category) {
        this.nameLot = name;
        this.descLot = desc;
        this.priceLot = price;
        this.categoryLot = category
    }

}

$(document).ready(function() {
    $(document).on("click", "#btn-form2", function() {
        const lot = new someLot();
        lot.setParams($('#name').val(), $('#desc').val(), $('#price').val(), $('#cat').val());
        console.log(JSON.stringify(lot));

    });

});