const connections = require('../app/database')
const typeString = require('../utile/bufferTurnString')

class UserService { 
  // 注册
  async create(user) {
    const {userId, password, username, avatar, sex, ip, uuip, summary} = user
    // console.log(user,477);
    const sql = `INSERT INTO users (userId, PASSWORD, username, avatar, sex, ip, uuip, summary) VALUE (?, ?, ?, ?, ?, ?, ?, ?);`
    const result = await connections.execute(sql, [userId, password, username, avatar, sex, ip, uuip, summary])
    // console.log(result);
    return result
   
  }

  // 查询单个用户信息  
  async getUsername(userId) {      
    // console.log(userId,18);
  const sql = `SELECT * FROM users WHERE userId = ?;`
  const [result] = await connections.execute(sql, [userId])
  
  return typeString(result) 
  } 
  // 根据房间id查询在线用户列表  
  async getUserListByRoomId(roomId) { 
    if(roomId){
      console.log(roomId,18);
      const sql = `SELECT * FROM users WHERE roomId = ? && isOnline = 1;`
      const [result] = await connections.execute(sql, [roomId])
      // console.log(result);
      return typeString(result) 
    }     
    console.log(roomId+'为undefined');
  }  

  // 更新 
  async update(user){ 
    console.log(user);  
    // console.log(user.username, user.avatar, user.sex,user.ip,user.uuip,user.summary,user.userId);
    try {
      // const sql = `update users set username = ?,  sex = ? ,  summary = ? where  userId = ?`
      // const [result] = await connections.execute(sql, [user.username,  user.sex,user.summary,user.userId])
      const sql = `update users set username = ?, avatar = ?, sex = ? , ip = ?, uuip = ?, summary = ? where  userId = ?`
      const [result] = await connections.execute(sql, [user.username, user.avatar, user.sex,user.ip,user.uuip,user.summary,user.userId])
      return result
    } catch (error) {
    
      console.log(error);
    }
   
  }
  
  // 更新用户在线状态
  async updateOnline(userId='q111',i){ 
    // console.log(userId,19); 
    const sql = `update users set isOnline = ?  where  userId=?`
    const [result] = await connections.execute(sql,[i,userId])
    return result
  }
  // 更新用户房间Id
  async updateRoomId(userId='q111',i){ 
    // console.log(userId,19); 
    const sql = `update users set roomId = ?  where  userId=?`
    const [result] = await connections.execute(sql,[i,userId])
    return result
  }

  // 用户收藏歌曲
  async collectionSong(data){
    // console.log(data.userId)
    const [res] = await this.getUsername(data.userId)
    // console.log(res);
    // console.log(data);
    let collectionSongList = []
    if(!res.collectionSongList){
     collectionSongList.push(data)
     const sql = `update users set collectionSongList = ?  where  userId=?`
     const result = await connections.execute(sql,[collectionSongList, data.userId])
    //  console.log(collectionSongList);
     return result
    }

    collectionSongList = JSON.parse(res.collectionSongList)
    let iscollection = collectionSongList.every(item => {
       return item.hash !== data.hash
    })
    console.log(iscollection);
    if(iscollection){ 
      collectionSongList.push(data)
      const sql = `update users set collectionSongList = ?  where  userId=?`
      const result = await connections.execute(sql,[collectionSongList, data.userId])
     //  console.log(collectionSongList);
      return result
    }
    console.log('重复收藏');
    return null
  }
  
  // 删除歌曲
  async deleteSong(data){
    
      const [res] = await this.getUsername(data.userId)
      console.log(res.collectionSongList);
      let collectionSongList = []
      collectionSongList = JSON.parse(res.collectionSongList).filter(item => {
        return item.hash !== data.hash
      })
      console.log(collectionSongList);
      const sql = `update users set collectionSongList = ?  where  userId=?`
      const result = await connections.execute(sql,[collectionSongList, data.userId])
     //  console.log(collectionSongList);
      return result
    

    // if(type === 'selected'){
 
    // }
  }
}
 
module.exports = new UserService()