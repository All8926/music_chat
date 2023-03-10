const roomService = require('../service/room_service')
const getSongList = require('../utile/playmusic')

class RoomController{
  // 创建房间
  async create(ctx,next){
    const {roomId, password,isLock,roomname,roomAvatar,roomSum} = ctx.request.body
    const result = await roomService.create(roomId, password,isLock,roomname,roomAvatar,roomSum)
    // console.log(result);
    getSongList.getSongList()
    if(result.length){
      
      return ctx.body = {
        status:200,
        message:'创建房间成功'
      }
      
    }
  
  }

  // 获取房间已点歌曲
  async getChooseASongList(ctx,next){
    const {roomId} = ctx.params
    console.log(roomId+'roomid');
    const result = await roomService.getChooseASong(roomId)
    let res = JSON.parse(result)
    ctx.body = res
  }

    // 获取房间信息
  async getRoomInfo(ctx){
    const {roomId} = ctx.params
    console.log(roomId+'roomid');
    const [result] = await roomService.getRoomById(roomId)
    // console.log(result);
    ctx.body = result
  }

  async updateSwitchCount(ctx){
    const {count} = ctx.request.body
    const {roomId} = ctx.request.body
    // console.log('更改票数');
    // console.log(count,roomId);
    const result = await roomService.updateSwitchCount(count,roomId)
    // console.log(result);
    ctx.body = result
  }
}

module.exports= new RoomController()