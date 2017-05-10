const trajectory = require('./childProcess/trajectory');
console.log(typeof trajectory);
const input = [
    [476.0, 518.0],
    [478.0, 517.0],
    [480.0, 516.0],
    [483.0, 512.0],
    [486.0, 508.0],
    [484.0, 496.0],
    [482.0, 491.0],
    [482.0, 489.0],
    [480.0, 482.0],
    [480.0, 475.0],
    [480.0, 467.0],
    [478.0, 456.0],
    [472.0, 448.0],
    [468.0, 445.0],
    [464.0, 437.0],
    [460.0, 429.0],
    [459.0, 415.0],
    [459.0, 398.0],
    [461.0, 372.0],
    [462.0, 340.0],
    [476.0, 302.0]
];

//trajectoryId must < 0
trajectory('/Users/taotanming/project/tracks-exception-inspection/trajectory/hurricane2000_2006.tra', input, '-1').then(data => {
    // console.log(data.stdout.toString());
    console.log(JSON.parse(data.stdout.toString()));
}, data => {
    data.stdout = data.stdout.toString();
    data.stderr = data.stderr.toString();
    console.log(`Error occurred. Code ${data.code}`);
    console.log(data);
}).catch( err => {console.log(err)});
