const KoaRouter = require('koa-router')

const fileRouter = new KoaRouter()


const { verifyAuth} = require('../moddleware/login_moddleware')
const {avatarHandler,} = require('../moddleware/file_moddleware')
const {saveAvatarInfo} = require('../controller/file.controller')

fileRouter.post('/avatar',verifyAuth, avatarHandler, saveAvatarInfo)

module.exports = fileRouter  