const messageService = require('../service/message_service')

class MessageController{
  // 获取消息数据接口的逻辑处理 
  async getMessageList(ctx,next){
    const {roomId} = ctx.params
    const {limit} = ctx.query
    const {offset} = ctx.query
    const result = await messageService.getMessageList(roomId,limit,offset)
    // console.log(result);
    ctx.body = result
  }
}  

module.exports = new MessageController()  