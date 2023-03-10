const connections = require('../app/database')
const typeString = require('../utile/bufferTurnString')
const userService = require('./user_service')
class MessageService{
  // 添加消息
  async create(data){ 
    // if(data[0].type < 0) return data
    // console.log(data,777);
    const data1 = data[0] 
    const data2 = data[1]
    // console.log(data2.userId,data2.username, data1.content,data2.roomId,data1.type,data2.avatar,data2.uuip,data2.ip,data1.time);
    // if(data1.type > 0){
      const sql = `INSERT INTO message (userId, content, roomId, type, time) VALUE (?, ?,?, ?,?);`
      const [result] = await connections.execute(sql, [data2.userId,data1.content,data2.roomId,data1.type,data1.time])
 
      // console.log(userinfo); 
      return data 
    // }
 
    // 进去房间的提示消息
    // if(data1.type === -1){
    //   const sql = `INSERT INTO message (userId, content, roomId, type,time) VALUE (?, ?, ?, ?,?);`
    // const [result] = await connections.execute(sql, [data2.userId,data1.content,data2.roomId,data1.type,data1.time])
    // return result 
    // }
    
     

  }

  // 获取消息
  async getMessageList(roomId,limit,offset){
    console.log(roomId+' roomId');
    const sql = `SELECT * FROM message WHERE roomId= ? && type > 0 ORDER BY id DESC LIMIT ? OFFSET ? `
    const [result] = await connections.execute(sql, [roomId,limit,offset])
    const newRes = typeString(result)
    const res = []
  for (const item of newRes) {
    const [userinfo] = await userService.getUsername(item.userId)
    let newContent =  {...item,...userinfo};
    res.push(newContent)
  }
    // console.log(res);
    return typeString(res) 
  }

  // 删除消息
  async deleteMessage(type){
    const sql = `delete from message  where type = ?`
    const result = await connections.execute(sql,[type])
    return result
  }
} 

module.exports = new MessageService()