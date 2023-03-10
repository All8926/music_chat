const KoaRouter = require('koa-router')

const userRouter = new KoaRouter({prefix:'/user'})

const {verifyUser, handlePassword} = require('../moddleware/user_moddleware')
const {verifyAuth} = require('../moddleware/login_moddleware')
const {cosUpdate} = require('../moddleware/cosupdate_mpddleware')

const {create,getip,update, getUserinfoByid, addCollectionSong,deleteCollectionSong, avatarInfo, updateRoomId} = require('../controller/user_controller')

// 注册接口  
userRouter.post('/',verifyUser, handlePassword, create)
userRouter.get('/getip',getip)
// 更新个人信息接口 
userRouter.post('/update',verifyAuth, cosUpdate, update) 

userRouter.post('/updateRoomId',verifyAuth, updateRoomId) 
// 获取用户信息接口  
userRouter.get('/:userId',verifyAuth, getUserinfoByid)
// 用户添加收藏歌曲
userRouter.post('/collection',verifyAuth, addCollectionSong) 
// 用户删除收藏歌曲
userRouter.post('/deletecollection',verifyAuth, deleteCollectionSong) 
 
userRouter.get('/:userId/avatar', avatarInfo)
module.exports = userRouter