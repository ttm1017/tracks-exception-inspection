/**
 * Created by ttm on 17/4/9.
 */

const Koa = require('koa')
    , logger = require('koa-logger')
    , onerror = require('koa-onerror')
    , bodyParser = require('koa-bodyparser')
    , mount = require('koa-mount');

const index = require('./server/routes/index');
const app = new Koa();
// error handler
onerror(app);

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

