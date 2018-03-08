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
const {setSession} = require('./server/controllers/session');
const app = new Koa();


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

//静态路由中间件
app.use(koaStatic(
    path.join(__dirname , './res')
));

//添加鉴权认证中间件，位于静态路由后面，静态路由不用进行认证
setSession(app);

app.use(routers.routes()).use(routers.allowedMethods());

app.use(async (ctx) => {
    const user = ctx.session.user || null;
    ctx.response.body = env.render('index.html', {user: user || {user: '', email: ''}});
});

let server = app.listen(config.port);
ws.createWS(server);

console.log(`Listening on ${config.port}...`);