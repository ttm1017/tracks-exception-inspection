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
const wss = new WebSocket.Server({ port: 8001 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        if (message.status == 'overLead') {

        }
    });

    ws.send(JSON.stringify({a:1}));
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

app.use(mount('/assets' ,require('koa-static')(__dirname + '/dist')));

// routes definition
app.use(index.routes()).use(index.allowedMethods());

app.listen(3000);

