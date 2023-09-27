function readJSON() {
    const fs = require("fs");
    fs.readFile('C:\\Users\\Andrey\\Desktop\\testProject\\server\\public\\json\\thing.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        const obj = JSON.parse(data);
        console.log(obj);
    });
}
readJSON();