const jwt = require('jsonwebtoken') 

const errorTypes = require('../constancs/error_types')
const userService = require('../service/user_service')
const md5Password = require('../utile/password_handle')
const { PUBLIC_KEY } = require('../app/config')

// 登录验证
const verifyLogin = async (ctx,next) => {
  // console.log(ctx.request.body);
  // 1.获取账号和密码
  const {userId, password} = ctx.request.body
  // console.log(userId, password);

  // 2.判断账号或密码是否为空
  if(!userId || !password){
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error',error, ctx)
  }

  // 3.判断用户是否存在
  const [result] = await userService.getUsername(userId)
  console.log(result,555);

  if(!result){
    console.log(456);
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS)
    return ctx.app.emit('error',error, ctx)
  }

  // 4.判断密码是否正确
  if(md5Password(password.toString()) !== result.password.toString()){
    const error = new Error(errorTypes.USER_DOES_ERROR)
    ctx.body = '密码错误'
    return ctx.app.emit('error',error, ctx)
  
  }
  ctx.body = '登录成功'
  ctx.user = result
  // console.log(ctx.user);
  await next()
  
}

// 验证登录状态
const verifyAuth = async (ctx, next) => {
  console.log(123);
  // 获取token
  const authorization = ctx.headers.authorization
  if(!authorization){
    const error = new Error(errorTypes.UNAUTHORIZATTON)
    return ctx.app.emit('error',error,ctx)
  }

  const token = authorization.replace('Bearer ', '')
  console.log(token+' 55');
  // 验证token
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256'] 
    })
    ctx.user = result
    await next()

    
  } catch (err) {
    console.log(err);
    const error = new Error(errorTypes.UNAUTHORIZATTON)
    return ctx.app.emit('error', error, ctx)
    
  }
}

  

module.exports = {
  verifyLogin,
  verifyAuth
}