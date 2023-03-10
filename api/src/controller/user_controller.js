const userService = require('../service/user_service')
const axios = require('axios')
class UserController {
  // 注册用户
  async create(ctx, next){
    const user = ctx.request.body
    console.log(user);
    const result = await userService.create(user)
    ctx.body = {
      status : 200,
      message : '注册成功'
    }
  }

    // 获取ip
    async getip(ctx, next){
      // const user = ctx.request.body
      // console.log(user);
      console.log('获取ip');
      const result = await axios.get('https://apis.map.qq.com/ws/location/v1/ip?key=QMDBZ-4VE6X-IKG45-TJSJ6-ELUB7-LPB63')
      console.log(result.data)
      ctx.body = result.data
  }

  // 更新用户信息
  async update(ctx,next){
 
    const user = ctx.request.body
    console.log(user);
    const result = await userService.update(user) 
    ctx.body = {
      status : 200,
      message : '用户信息更新成功'
    } 
  }
  // 更新用户房间Id
  async updateRoomId(ctx,next){
 
    const user = ctx.request.body
    console.log(user);
    const result = await userService.updateRoomId(user.userId,user.roomId) 
    ctx.body = {
      status : 200,
      message : '用户信息更新成功' 
    } 
  }

  // 根据 userId 获取用户信息
  async getUserinfoByid(ctx, next){
    
    try { 
      // console.log(ctx.request.body,556);
      const {userId} = ctx.params
      // console.log(userId,7732);
      const [result] = await userService.getUsername(userId)
      // console.log(result); 
      ctx.body = result
      return result 
    } catch (error) {
      console.log(error) ;  
    } 
  
  }

  // 收藏歌曲
  async addCollectionSong(ctx,next){
    const data = ctx.request.body
    // console.log(data);
    const result = await userService.collectionSong(data)
    // console.log(result);
    ctx.body = result
    
  }
  
  // 删除收藏歌曲
  async deleteCollectionSong(ctx,next){
    const data = ctx.request.body
    // console.log(data);
    const result = await userService.deleteSong(data)
    // console.log(result);
    ctx.body = result
  }

  async avatarInfo(ctx,next){
    const {userId} = ctx.params
    const avaratInfo = await fileService.getAvatarByUserId(userId)

    // 提供图像信息
    ctx.response.set('content-type', avaratInfo[0].mimetype)  // 返回后显示图片
    ctx.body = fs.createReadStream(`./uploads/avatar/${avaratInfo[0].filename}`)
  }
}

module.exports = new UserController()