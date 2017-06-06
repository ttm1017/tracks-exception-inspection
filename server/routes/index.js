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

const trajectoryHistoryExam = require('./childProcess/trajectory');

let bf = Buffer.alloc(0);
const rs = fs.createReadStream(path.resolve(__dirname, '../../dist/example.html'));
rs.on('data', function (chunk) {
    bf = Buffer.concat([bf, chunk])
});
rs.on('end', function () {
    // console.log(bf.toString());
    // return true;
});
//variable
const outline = [];
let isNeedUpdate = false;
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
            console.log(`${parseFloat(value.point[value.point.length - 2]).toFixed(3)},${parseFloat(value.point[value.point.length - 1]).toFixed(3)}`)
        }
        if (parseFloat(value.point[value.point.length - 2]).toFixed(0) === parseFloat(destinationPosition.desLat).toFixed(0) && parseFloat(value.point[value.point.length - 1]).toFixed(0) === parseFloat(destinationPosition.desLon).toFixed(0)) {
            let arr = [];
            for (let i = 0; i < value.point.length; i += 2) {
                arr.push([value.point[i], value.point[i + 1]]);
            }
            destinationRoute.push({id: value.id, points: arr});
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
    await next();
});
router.get('/trajectory', async function (ctx, next) {
    const {trajectoryType, trajectoryId}= ctx.request.query;
    let {trajectoryPoints} = ctx.request.query;
    let errInfo;
    trajectoryPoints = JSON.parse(decodeURI(trajectoryPoints));
    if (trajectoryType === 'history') {
        trajectoryHistoryExam('/Users/taotanming/project/tracks-exception-inspection/data/afdata.js', trajectoryPoints, -1)
            .then(data => {
                isNeedUpdate = true;
                // console.log(data.stdout.toString());
                const historyOutline = JSON.parse(data.stdout.toString());
                console.log('===history');
                console.log(historyOutline);
                let outlineObj;
                //get if is the outline
                const isOutline = historyOutline.some((value) => {
                   if (value.trajectoryId === -1) {
                       outlineObj = value;
                       return true;
                   }
                });
                if (isOutline) {
                    let trajectoryObj;
                    if (outline.some((value) => {
                        if(value.trajectoryId === trajectoryId){
                            trajectoryObj = value;
                            return true;
                        }
                    }) === false) {
                        outline.push({
                            trajectoryId,
                            outline: [{
                                type: 'history',
                                info: '与历史轨迹数据匹配不符合',
                                partition: outlineObj.outlyingPartitions
                            }]
                        })
                    };
                    if (trajectoryObj != null) {
                        let isCurrent = false;
                        for (let tra of trajectoryObj.outline) {
                            if (tra.type === 'history') {
                                Object.assign(tra, {partition: outlineObj});
                                isCurrent = true;
                            }
                        }
                        if (!isCurrent) {
                            trajectoryObj.outline.push({
                                type: 'history',
                                info: '与历史轨迹数据匹配不符合',
                                partition: outlineObj
                            })
                        }
                    }
                }
                else {
                    let trajectoryObj = {
                        outline: []
                    };
                    outline.some((value) => {
                        if(value.trajectoryId === trajectoryId){
                            console.log('hasBE');
                            let isCurrent = false;
                            for (let tra of value.outline) {
                                if (tra.type === 'history') {
                                    Object.assign(tra, {partition: null, info: '与历史数据符合'});
                                    isCurrent = true;
                                }
                            }
                            if (!isCurrent) {
                                trajectoryObj.outline.push({
                                    type: 'history',
                                    info: '与历史数据符合'
                                })
                            }
                            return true;
                        }
                    }) != true ? outline.push({
                        trajectoryId,
                        outline: [{
                            type: 'history',
                            info: '与历史数据符合'
                        }]
                    }) : '';
                }
                console.log('====outline');
                console.log(outline);
            }).catch(err => {
            console.log(err);
            errInfo = {err, info: '服务器错误请稍后再试'};
        });
        ctx.body = {
            trajectoryId,
            outline: [{
                type: 'history',
                info: '正在进行与历史数据是否符合历史检测'
            }]
        };
    }
    else {
        //get current trajectoryID object
        let currentTrajectory;
        if(!outline.some((value) => {
            if(value.trajectoryId === trajectoryId) {
                currentTrajectory = value;
                currentTrajectory.outline.some((value) => {
                    if (value.type === 'history') {
                        currentTrajectory.outline = [value]
                    }
                    else {
                        currentTrajectory.outline = []
                    }
                });

                return true;
            }
        })) {
            currentTrajectory = {
                trajectoryId,
                outline: []
            };
        };
        //入侵检测
        let temporaryValue, temporaryIndexStart, temporaryIndexEnd;
        //propery is [indexStart, indexEnd]
        const IntrusionDetection = [];
        trajectoryPoints.forEach((value, index, arr) => {
            if (temporaryValue != null && temporaryIndexEnd != null) {
                //make calculate after some values
                if (index - temporaryIndexEnd > 2) {
                    if (temporaryValue == value) {
                        temporaryIndexEnd = index;
                    }
                    else {
                        IntrusionDetection.push([temporaryIndexStart, temporaryIndexEnd]);
                        temporaryValue = temporaryIndexStart = temporaryIndexEnd = null;
                    }
                }
            }
            if (value === arr[index+1] && value === arr[index + 2]) {
                temporaryValue = value;
                temporaryIndexStart = index;
                temporaryIndexEnd = temporaryIndexStart;
            }
        });
        if (IntrusionDetection.length !== 0) {
            const partition = IntrusionDetection.map((value) => {
                value[1] ++;
                return trajectoryPoints.slice(...value);
            });
            currentTrajectory.outline.push({
                type: 'intrusion',
                info: '存在入侵异常',
                partition: partition
            })
        }

        //轨迹数据范围检测异常
        let isDetected = false;
        trajectoryPoints.forEach((value, index, arr) => {
            if (value[0] > 90 && !isDetected) {
                currentTrajectory.outline.push({
                    type: 'rangeException',
                    info: '轨迹数据范围异常'
                });
                isDetected = true;
            }
        });
        //目的地检测异常
        const startPoint = trajectoryPoints[0];
        const endPoint = trajectoryPoints[trajectoryPoints.length-1];
        const destinationArr = [];
        trajectoryPoints.some((value, index, arr) => {
            if ( arr[index+10] == null) return true;
            const xe = endPoint[0] - startPoint[0],
                ye = endPoint[1] - startPoint[1],
                xs = arr[index+10][0] - value[0],
                ys = arr[index+10][1] - value[1];
            const VectorProduct = xe*xs+ye*ys;
            if (VectorProduct < 0) {
                destinationArr.push([index, index+11]);
            }
        });
        const temporaryStore = [];

        for (let i = 0; i < destinationArr.length - 1; i++) {
            const value = destinationArr[i];
            if (value[1] >= destinationArr[i+1][0]) {
                let end;
                for (let j = i+1; j < destinationArr.length; j++){
                    if (destinationArr[j+1] == null) break;
                    if (destinationArr[j][1] < destinationArr[j+1][0]) {
                        end = j;
                        break;
                    }
                }
                if (end != null) temporaryStore.push([destinationArr[i][0], destinationArr[end][1]]);
            }
        }
        //get partition
        const partition  = temporaryStore.map((value) => {
            return trajectoryPoints.slice(value[0], value[1]+1);
        });
        currentTrajectory.outline.push({
            type: 'destinationDetect',
            info: '目的地异常',
            partition: partition
        });

        if (!outline.some((value) => {
                if(value.trajectoryId === trajectoryId) {
                    Object.assign(value, currentTrajectory);
                    return true;
                }
            })) {
            outline.push(currentTrajectory);
        }
        ctx.body = currentTrajectory;
    }
    await next();
});
router.get('/result', async function (ctx, next) {
    if (isNeedUpdate) {
        ctx.body = {
            outline
        };
    }
    else {
        ctx.body = {
            isNeedUpdate: false
        };
    }
    next();
});
router.get('/test', async function (ctx, next) {
    ctx.body = 'test';
    next();
});

module.exports = router;
