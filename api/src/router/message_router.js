const KoaRouter = require('koa-router')

const messageRouter = new KoaRouter({prefix:'/message'})

const {getMessageList} = require('../controller/message_controller')
const {verifyAuth} = require('../moddleware/login_moddleware')

messageRouter.get('/:roomId',verifyAuth,getMessageList)

module.exports = messageRouter 