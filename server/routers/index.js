/**
 * Created by Jad on 2017/7/26.
 */
const routers = require('koa-router')();
const apiRouters = require('./api');
const {env} = require('./../utils/renderer');
const {login, logout, register} = require('./../controllers/session');

routers.get('/', async (ctx) => {
    const user = ctx.session.user || null;
    ctx.response.body = env.render('index.html', {user: user || {user: '', email: ''}});
});
routers.use('/api', apiRouters.routes(), apiRouters.allowedMethods());
routers.post('/login', login);
routers.get('/logout', logout);
routers.post('/register', register);

module.exports = routers;