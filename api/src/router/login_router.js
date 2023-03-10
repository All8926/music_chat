const KoaRouter = require('koa-router')

const loginRouter = new KoaRouter()

const {verifyLogin, verifyAuth} = require('../moddleware/login_moddleware')

const {login, loginSuccess} = require('../controller/login_controller')

// 登录接口
loginRouter.post('/login',verifyLogin, login)  
// 验证token接口
loginRouter.get('/test',verifyAuth, loginSuccess)

module.exports = loginRouter