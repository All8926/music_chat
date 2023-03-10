const errorTypes = require('../constancs/error_types')
const roomService = require('../service/room_service')
const md5Password = require('../utile/password_handle')

// 注册前进行验证
const verifyRoom = async (ctx,next) => {
  // 1.获取用户名和密码
  const {roomId, password,isLock,roomname} = ctx.request.body



  // 2.验证是否为空
  if(!roomId || !roomname){ 
      const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error',error, ctx)
  
  }

  if(isLock){
    if(!password){ 
      const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error',error, ctx)
  }
  }

  // 3.验证房间号是否已被注册
  const result = await roomService.getRoomById(roomId)
  // console.log(result,456);
  if(result.length){
    const error = new Error(errorTypes.NAME_ALREADY_EXISTS)
    return ctx.app.emit('error',error,ctx)
  }
  console.log('创建房间验证成功');
  await next()
 

}

  // 4.对密码进行加密
  const handlePassword = async (ctx, next) => { 
    const {password} = ctx.request.body
    if(password){
      ctx.request.body.password = md5Password(password.toString())
    }
     
      await next()
 
  }

  const verifyRoomPassword = async (ctx, next) => {
    const {modulepassword, password} = ctx.request.body
    console.log(password, modulepassword);
    if(md5Password(modulepassword.toString()) !== password.toString()){
      const error = new Error(errorTypes.USER_DOES_ERROR)
      ctx.body = '密码错误'
      return ctx.app.emit('error',error, ctx)
    
    }
    ctx.body = {
      status:200
    }
   await next()
  }
  

module.exports = { 
  verifyRoom,
  handlePassword,
  verifyRoomPassword
} 