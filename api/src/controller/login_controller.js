const jwt = require('jsonwebtoken')
const {PRIVATE_KEY} = require('../app/config')

class LoginController{
  // 登录生成token
  async login(ctx, next){
    const {id, userId} = ctx.user
    // console.log(id, userId);
    const token = jwt.sign({id,userId},PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24 * 7,  // 设置token 7天过期，单位为秒
      algorithm: 'RS256'
    })
    ctx.body = {
      id, userId, token,
      status : 200,
    }
  }

  // 验证登录成功
  async loginSuccess(ctx,next){
    ctx.body = {
      status:200,
      message:'token有效'
    }
  }
}

module.exports = new LoginController()