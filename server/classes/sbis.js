const request = require('request');

class SBIS {
    connection() {
        request({
            url: "https://online.sbis.ru/oauth/service/",
            method: "POST",
            json: true,   // <--Very important!!!
            headers: 'Content-type: charset=utf-8',
            body: {"app_client_id":"2745473257412725","app_secret":"KYMU3TGDEXMXXEFTJPDHTJ6P","secret_key":"XHr53LOCo0UnKbRbq46AN8B4aQL41x5Tga94DFWk9jY91FjTb3GskXbRKZO8H38SQPBK4xB8JFYwVmpKFK0d0pkvP7HPIO4NuLNLibNHRFcvL1fssd6U0b"}
        }, function (error, response, body){
            if(error) {
                console.log('Access denied because:');
                console.log(error);
                return false;
            }
            console.log('Successfully connection!');
            console.log(body);
            return true;
        });
    }

    billRegistrationForCash(officialItems) {
        let nomenclature = [];
        let totalVat20 = 0;
        let totalCost = 0
        officialItems.forEach(item => {
            totalCost += item.price*item.count;
            totalVat20 += (item.price*item.count)*20/120
            nomenclature.push({
                    "nameNomenclature": item.name,
                    "priceNomenclature": `${item.price}`,
                    "quantityNomenclature": `${item.count}`,
                    "measureNomenclature": "ШТ",
                    "kindNomenclature": "Т",
                    "totalPriceNomenclature": `${item.price*item.count}`,
                    "taxRateNomenclature": "20",
                    "totalVat": `${totalVat20}`
            })
        });
        console.log(nomenclature);
        request({
            url: "https://api.sbis.ru/retail/sale/create",
            method: "post",
            json: true,   // <--Very important!!!
            headers: {"Content-type": "charset=utf-8", "Cookie" : "sid=01e9282e-020fcc95-eedb-dbb79a6e6a144d45", "X-SBISAccessToken" : "TWV8KDhEY2UsVTQ5JiM2UUBoO3I1WTw8PHRLOCgyJCwzdVZjMXpMI3VDZUxjRlBdQjJvKjowS1BfVUdXUjghfjIwMjQtMDUtMDMgMTM6NTM6MDIuOTg3ODgw"},
            body: {
                "companyID": process.env.FILIAL_ID,
                "kktRegNumber": process.env.KKT_REGNUM,
                "cashierFIO": "Администратор",
                "operationType": "1",
                "cashSum": `${totalCost}`,
                "bankSum": null,
                "internetSum": null,
                "accountSum": null,
                "postpaySum": null,
                "prepaySum": null,
                "vatNone": "0",
                "vatSum0": "0",
                "vatSum10": "0",
                "vatSum20": `${totalVat20}`,
                "vatSum110": "0",
                "vatSum120": "0",
                "allowRetailPayed": "1",
                "nomenclatures": nomenclature,
                "customerFIO": null,
                "customerEmail": null,
                "customerPhone": null,
                "customerINN": null,
                "customerExtId": null,
                "taxSystem": "2",
                "sendEmail": null,
                "propName": null,
                "propVal": null,
                "comment": "тестовый чек",
                "payMethod": "4"
              }
        }, function (error, response, body){
            console.log(body);
        });
    }
}
module.exports = SBIS;