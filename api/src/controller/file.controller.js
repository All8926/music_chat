const errorTypes = require('../constancs/error_types')
const userService = require('../service/user_service')
const fs = require('fs')
const path = require('path')
const Cos = require('cos-nodejs-sdk-v5')
var cos = new Cos({
  SecretId: 'AKIDMZL0QcZIn21mcMH1ay61tZ2KUREqGSQB',
  SecretKey: 'czGMG8rYFo8HEF9tRwEI8vdHjATccOvE'
});

class FileController {
  async saveAvatarInfo(ctx, next) {
    try {
 
      // console.log(ctx.request.files);
      // console.log(ctx.req.file);
      // console.log(ctx.body);
      const { mimetype, filename, size } = ctx.req.file
      const userId = ctx.user.userId
      // 获取用户所在房间号
      const [result] = await userService.getUsername(userId)
      console.log(result.roomId);
      const roomId = ctx.user.roomId
      console.log(  ctx.user);
      console.log(mimetype);
      console.log(filename);
      console.log(size);
      let folder = ''
      let fileName = ''
      let fileFormat = filename.split("."); //以点分割成数组，数组的最后一项就是后缀名
      if(filename.indexOf('avatar118926') !== -1){
        console.log('我是头像！！！！');
        folder = 'avatar/'
        fileName = userId + "-" + fileFormat[0]
      }else{
        folder = 'message_image/'
         fileName = result.roomId + "-" + userId + "-" + fileFormat[0]
      }
     
     
    setTimeout(() => {
      fs.unlink(`./uploads/avatar/${filename}`, function (err) {
        console.log(err);
      })
    }, 200);
      let type = mimetype.slice(0, 5)
      if (type !== 'image') {
        const error = new Error(errorTypes.FILE_FORMAT_ERROR)
        return ctx.app.emit('error', error, ctx)
      }
      if(size > 1048576){
        const error = new Error(errorTypes.FILE_SIZE_ERROR)
        return ctx.app.emit('error', error, ctx)
      }
      
      // 提供图像信息
      // ctx.response.set("Access-Control-Allow-Origin", "*")  // 返回后显示图片
      const fileObj = fs.createReadStream(`./uploads/avatar/${filename}`)
      let filePath = path.join(__dirname, 'uploads/avatar/') + `${filename}`;
      console.log(filePath);
      const res = await cos.putObject({
        Bucket: 'img-1300544529', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-guangzhou',  /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: `${folder}${fileName}`,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD',
        Body: fileObj, // 上传文件对象
      })
      console.log(res); 

      if (res.statusCode === 200) {
        ctx.body = res
      }

    } catch (error) {
      console.log(error);
    }

  }
}

module.exports = new FileController()