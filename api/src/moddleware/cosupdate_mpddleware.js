const Cos = require('cos-nodejs-sdk-v5')
var cos = new Cos({
  SecretId: 'AKIDMZL0QcZIn21mcMH1ay61tZ2KUREqGSQB',
  SecretKey: 'czGMG8rYFo8HEF9tRwEI8vdHjATccOvE'
});

const cosUpdate = async (ctx, next) => {
  const user = ctx.request.body
  console.log(user.avatar.length + ' length');
  let avatarKey = user.avatar.slice(user.avatar.length - 39, user.avatar.length)
  console.log(avatarKey);
  let deleteHistoryAvatarList = []
  try {
    const res = await cos.getBucket({
      Bucket: 'img-1300544529', /* 填入您自己的存储桶，必须字段 */
      Region: 'ap-guangzhou',  /* 存储桶所在地域，例如ap-beijing，必须字段 */
      // Prefix: 'avatar/aaa123',   /* Prefix表示列出的object的key以prefix开始，非必须 */
      Prefix: `avatar/${user.userId}`,   /* Prefix表示列出的object的key以prefix开始，非必须 */
      MaxKeys: 1000,
    })
    if (res.statusCode !== 200) {
      ctx.body = {
        status: 201,
        message: '用户信息更新失败'
      }
    }
    console.log(res.Contents);
    res.Contents.forEach(item => {
      if (item.Key !== avatarKey) {
        let obj = {
          Key: item.Key
        }
        deleteHistoryAvatarList.push(obj)
      }
    });
    console.log(deleteHistoryAvatarList);
    if (!deleteHistoryAvatarList.length) return await next()
    // 删除用户历史头像
   const red = await cos.deleteMultipleObject({
      Bucket: 'img-1300544529', /* 填入您自己的存储桶，必须字段 */
      Region: 'ap-guangzhou',  /* 存储桶所在地域，例如ap-beijing，必须字段 */
      Objects: deleteHistoryAvatarList
    })
    // console.log(red);
    await next()
  } catch (error) {
    console.log(error);
  }


  // console.log(data.Contents);
 
}

module.exports = {
  cosUpdate
}