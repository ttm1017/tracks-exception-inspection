/**
 * Created by ttm on 17/4/9.
 */

const Koa = require('koa')
    , logger = require('koa-logger')
    , onerror = require('koa-onerror')
    , bodyParser = require('koa-bodyparser')
    , mount = require('koa-mount')
    , WebSocket = require('ws');

const index = require('./server/routes/index');
const app = new Koa();
// error handler
onerror(app);
//build websocket
const wss = new WebSocket.Server({port: 8001});

wss.on('connection', function connection(ws) {
    let isStart = false;
    let lastRecivie = new Date();
    const currentTrajectory = [];
    let pointsCount = 0, cirleNumber = 0;
    let endPoint = [], startPoint = [];
    /**
     * message
     * @property {string} message.status
     * @property {Array} message.point
     */
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        message = JSON.parse(message);
        if (message.status == 'overLead') {
            isStart = false;
            lastRecivie = new Date();
            return;
        }
        if (message.status == 'start') {
            isStart = true;
            lastRecivie = new Date();
            endPoint = message.endPoint;
            startPoint = message.startPoint;
            return;
        }
        if (isStart && (new Date() - lastRecivie) / 1000 > 8) {
            const info = {
                type: 'error',
                errorInfo: `Can't get the signal`
            };
            ws.send(JSON.stringify(info));
            lastRecivie = new Date();
            return;
        }
        if (isStart && message.point !=null && message.status === 'leading') {
            lastRecivie = new Date();
            const point = message.point;
            currentTrajectory.push(point);
            pointsCount ++;

            if (pointsCount >= 5) {
                const xe = endPoint[0] - startPoint[0],
                    ye = endPoint[1] - startPoint[1],
                    xs = currentTrajectory[cirleNumber*30 + pointsCount-1][0] - startPoint[0],
                    ys = currentTrajectory[cirleNumber*30 + pointsCount-1][1] - startPoint[1];
                const VectorProduct = xe*xs+ye*ys;
                console.log(VectorProduct);
                if (VectorProduct < 0) {
                    const info = {
                        type: 'error',
                        errorInfo: `angle is deviate more`
                    };
                    ws.send(JSON.stringify(info));
                    pointsCount = 0;
                    cirleNumber++;
                    return;
                }
            }
            return;
        }

        if (!isStart && message.status === 'leading') {
            const info = {
                type: 'error',
                errorInfo: `The signal is not expected exist`
            };
            ws.send(JSON.stringify(info));
            return;
        }
    });
});

// global middlewares

app.use(bodyParser());

app.use(logger());

app.use(async function (ctx, next) {
    const start = new Date;
    await next();
    const ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(mount('/assets', require('koa-static')(__dirname + '/dist')));

// routes definition
app.use(index.routes()).use(index.allowedMethods());

app.listen(3000);

