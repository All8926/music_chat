const Koa = require('koa');
const bodyPasrer = require('koa-bodyparser')
const koaCors = require('koa-cors')

const useRouter = require('../router/index')
const errorHandler = require('./errorHandler')
const koaStatic = require('koa-static')

// import koaStatic from 'koa-static';

const app = new Koa();


app.use(koaCors())

// app.use(koaStatic('../../uploads'))

// 获取 post 提交的数据
app.use(bodyPasrer(),{multipart: true,});

useRouter(app)


app.on('error',errorHandler)

module.exports = app