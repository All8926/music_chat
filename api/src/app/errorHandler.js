const errorTypes = require('../constancs/error_types')

const errorHandler = (error, ctx) => {
  let status, message;
  switch (error.message) {
    case errorTypes.NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400;
      message = '信息不能为空'
      break;
    case errorTypes.NAME_ALREADY_EXISTS:
      status = 400;
      message = '该账号已被注册'
      break;
    case errorTypes.USER_DOES_NOT_EXISTS:
      status = 400;
      message = '该账号不存在'
      break;
    case errorTypes.USER_DOES_ERROR:
      status = 400;
      message = '密码错误'
      break;
    case errorTypes.UNAUTHORIZATTON:
      status = 401;
      message = 'token无效,请重新登录'
      break;
    case errorTypes.FILE_FORMAT_ERROR:
      status = 400;
      message = '文件格式错误'
      break;
    case errorTypes.FILE_SIZE_ERROR:
      status = 400;
      message = '文件大小超出限制'
      break;
  
    default:
      status = 201;
      message = '错误'
  }

  ctx.body = message
  ctx.status = Number(status)
 
}

module.exports = errorHandler