const errorTypes = require('../constancs/error_types')
const userService = require('../service/user_service')
const md5Password = require('../utile/password_handle')

// 注册前进行验证
const verifyUser = async (ctx,next) => {
  // 1.获取用户名和密码
  const {userId, password,username} = ctx.request.body

  // 2.验证是否为空
  if(!userId || !password || !username){ 
      const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error',error, ctx)
  
  }

  // 3.验证账号是否已被注册
  const result = await userService.getUsername(userId)
  // console.log(result,456);
  if(result.length){
    const error = new Error(errorTypes.NAME_ALREADY_EXISTS)
    return ctx.app.emit('error',error,ctx)
  }
  await next()


}

  // 4.对密码进行加密
  const handlePassword = async (ctx, next) => {
    const {password} = ctx.request.body
      ctx.request.body.password = md5Password(password.toString())
      await next()
  }
  

module.exports = {
  verifyUser,
  handlePassword
}