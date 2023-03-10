const KoaRouter = require('koa-router')

const roomRouter = new KoaRouter({prefix:'/room'})

const {create,getChooseASongList,getRoomInfo, updateSwitchCount} = require('../controller/room_controller')
const {verifyRoom,handlePassword,verifyRoomPassword} = require('../moddleware/room_moddleware')

// 创建房间
roomRouter.post('/',verifyRoom,handlePassword,create)
// roomRouter.get('/:roomId',verifyRoom,handlePassword,create)

// 获取房间已点歌曲
roomRouter.get('/getchooseasonglist/:roomId',getChooseASongList)

// 获取房间信息
roomRouter.get('/getRoomInfo/:roomId',getRoomInfo)

roomRouter.post('/updateSwitchCount',updateSwitchCount)

// 验证房间密码
roomRouter.post('/verifyRoomPassword',verifyRoomPassword)

module.exports = roomRouter 