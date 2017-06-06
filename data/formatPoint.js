const fs = require('fs');
const data = require('./AISdata');

const fsWriteSteam = fs.createWriteStream('./afdata.js');


fsWriteSteam.on('finish', () => {
    console.log('All writes are now complete.');
});
fsWriteSteam.write('2\n');
fsWriteSteam.write(`${data.length}\n`);
data.forEach((value) => {
    const newPoint = value.point.map((value) => {
       return value.toFixed(1)
    });
    const pointstr = newPoint.toString();

    const s = pointstr.replace(/,/g,' ');
    fsWriteSteam.write(`${value.id} ${value.point.length/2} ${s}\n`)
});