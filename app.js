console.log(process.env.NODE_ENV)
if(!process.env.NODE_ENV){
    process.env.NODE_ENV = 'development';
}

const Koa = require('koa');
const path = require('path');
const fs = require('fs');
const koaStatic = require('koa-static');
const bodyParser = require('koa-bodyparser');
const {env} = require('./server/utils/renderer');
const ws = require(path.resolve(__dirname, './server/models/webSock'));
const routers = require(path.resolve(__dirname, './server/routers/index'));
const config = require('./config');
const {setSession, getUser} = require('./server/controllers/session');
const app = new Koa();

setSession(app);

const NODE_ENV = process.env.NODE_ENV;

// 配置热加载
if(NODE_ENV == 'development' && config.hotUpdate) {
    const webpackHotMiddleware = require('koa-webpack-hot-middleware');
    const webpackDevMiddleware = require('koa-webpack-dev-middleware');
    const webpack = require('webpack');
    const webpackConfig = require(path.resolve(__dirname, './webpack.config'));
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
        noInfo: false,
        quiet: false,
        publicPath: webpackConfig.output.publicPath
    }));
    app.use(webpackHotMiddleware(compiler, {}));
}

app.use(bodyParser({
    formLimit: '5000kb'
}));
app.use(koaStatic(
    path.join(__dirname , './res')
));

app.use(routers.routes()).use(routers.allowedMethods());

app.use(async (ctx) => {
    const user = await getUser(ctx);
    ctx.response.body = env.render('index.html', {user: user || {user: '', email: ''}});
});

let server = app.listen(3000);
ws.createWS(server);

console.log('Listening...');