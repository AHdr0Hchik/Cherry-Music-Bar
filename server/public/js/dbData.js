const url = "../json/categories.json";

$.getJSON(url, function (data) {
    for(let i = 0; i<data.length; i++) {
        $('#cat').append('<option value="'+data[i].TABLE_NAME+'">'+data[i].TABLE_NAME+'</option>')
    }

});