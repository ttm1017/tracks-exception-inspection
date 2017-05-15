// const trajectory = require('./childProcess/trajectory');
// console.log(typeof trajectory);
// const input = [
//     [476.0, 518.0],
//     [478.0, 517.0],
//     [480.0, 516.0],
//     [483.0, 512.0],
//     [486.0, 508.0],
//     [484.0, 496.0],
//     [482.0, 491.0],
//     [482.0, 489.0],
//     [480.0, 482.0],
//     [480.0, 475.0],
//     [480.0, 467.0],
//     [478.0, 456.0],
//     [472.0, 448.0],
//     [468.0, 445.0],
//     [464.0, 437.0],
//     [460.0, 429.0],
//     [459.0, 415.0],
//     [459.0, 398.0],
//     [461.0, 372.0],
//     [462.0, 340.0],
//     [476.0, 302.0]
// ];
//
// //trajectoryId must < 0
// trajectory('/Users/taotanming/project/tracks-exception-inspection/trajectory/hurricane2000_2006.tra', input, '-1').then(data => {
//     // console.log(data.stdout.toString());
//     console.log(JSON.parse(data.stdout.toString()));
// }, data => {
//     data.stdout = data.stdout.toString();
//     data.stderr = data.stderr.toString();
//     console.log(`Error occurred. Code ${data.code}`);
//     console.log(data);
// }).catch( err => {console.log(err)});
//
const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
const router = new Router();

//load data
const data = require('../../data/AISdata');

let bf = Buffer.alloc(0);
const rs = fs.createReadStream(path.resolve(__dirname, '../../dist/example.html'));
rs.on('data', function (chunk) {
    bf = Buffer.concat([bf, chunk])
});
rs.on('end', function () {
    // console.log(bf.toString());
    // return true;
});

//router
router.get('/', async function (ctx, next) {
    ctx.body = bf.toString();
    await next();
});

router.get('/currentPosition', async function (ctx, next) {
   console.log(ctx.request.query);
   //ctx.request.query is the get method parameters
    let destinationRoute = [];
    const destinationPosition = ctx.request.query;
    let count = 0;
    data.some((value, index) => {
        if (count > 3) {
            return true;
        }
        if (index === 1) {
            console.log(`${parseFloat(value.point[value.point.length-2]).toFixed(3)},${parseFloat(value.point[value.point.length-1]).toFixed(3)}`)
        }
        if (parseFloat(value.point[value.point.length-2]).toFixed(0) === parseFloat(destinationPosition.desLat).toFixed(0) && parseFloat(value.point[value.point.length-1]).toFixed(0) === parseFloat(destinationPosition.desLon).toFixed(0)) {
            let arr = [];
            for (let i =0;i<value.point.length; i+=2) {
                arr.push([value.point[i], value.point[i+1]]);
            }
            destinationRoute.push({id :value.id, points: arr});
            count++;
        }
    });
    if (destinationRoute != null) {
        ctx.body = destinationRoute;
    }
    else {
        ctx.body = {
            status: 'NO_EXSITE'
        };
    }
});

module.exports = router;
