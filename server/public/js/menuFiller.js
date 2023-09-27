const fs = require("fs");

const array = (fs.readFileSync('../json/thing.json'));

const str = JSON.stringify(array);


console.log(array);



