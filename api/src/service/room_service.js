const connections = require('../app/database')
const typeString = require('../utile/bufferTurnString')
const addSongInfo = require('../utile/addSonginfo')
const { context } = require('../app')
// { getPlayUrlResult, getLyricResult}
class RoomService {
  // 创建房间
  async create(roomId, password = '', isLock, roomname, roomAvatar = '', summary = '') {
    const sql = `INSERT INTO rooms (roomId, password,isLock,roomname,roomAvatar,roomSum) VALUE (?, ?, ?, ?, ?, ?);`
    const result = await connections.execute(sql, [roomId, password, isLock, roomname, roomAvatar, summary])
    // console.log(result);
    return result
  }

  // 查询房间信息
  async getRoomById(roomId = 888) {
    // console.log(roomId+ '17 17');
    const sql = `SELECT * FROM rooms WHERE roomId = ?;`
    const [result] = await connections.execute(sql, [roomId])
    // console.log(result);
    return typeString(result)
  }

  // 删除房间和对应的消息
  async deleteRoom(roomId) {
    const sql = `DELETE FROM rooms WHERE roomId = ?;`
    const sql2 = `DELETE FROM message WHERE roomId = ?;`
    const [result] = await connections.execute(sql, [roomId])
    const [result2] = await connections.execute(sql2, [roomId])

    const res = await this.getRoomList()
    // console.log(result);
    return res
  }

  // 更新房间歌曲列表
  async updatSong(data) {
    // console.log(roomId);
    // console.log(data); 
    console.log('更新歌曲列表');
    const sql = `update rooms set songList = ?`
    const [result] = await connections.execute(sql, [data])
    return result
  }

  // 获取房间列表
  async getRoomList() {

    const sql = `select * from rooms; `
    const [result] = await connections.execute(sql)
    return typeString(result)
  }
 


  // 更新房间的在线人数
  async updateRoomOnlineCount(roomId,index){
    console.log(roomId+'更新房间人数');
    const [res] = await this.getRoomById(roomId) 
    
    let onlineCount = res.onlineCount + index
    // console.log(onlineCount);
    console.log(onlineCount +' onlineCount');
    const sql = `update rooms set onlineCount = ? where  roomId = ?`
    const [result] = await connections.execute(sql, [onlineCount, roomId])

    const [roominfo] = await this.getRoomById(roomId) 
    

    return roominfo.onlineCount
  }

  // 更新歌曲的开始时间
  async updateTime(data, roomId = 888) {
    // console.log(time);
     
    const play_url = await addSongInfo.getPlayUrlResult(data.mid)
    const lyrics = await addSongInfo.getLyricResult(data.mid)
    data.play_url = play_url
    data.lyrics = lyrics
    // console.log(data);
    const sql = `update rooms set startTime = ? where  roomId = ?`
    const [result] = await connections.execute(sql, [data, roomId])
    return result
  }

  // 更新房间切换歌曲的投票数
  async updateSwitchCount(count, roomId = 888) {

    // console.log(data);
    const sql = `update rooms set switchCount = ? where  roomId = ?`
    const [result] = await connections.execute(sql, [count, roomId])
    return result
  }
 
  // 用戶点歌
  async chooseASong(data) {
    const res = await this.getChooseASong(data.roomId)
    // console.log(JSON.parse(s));
    // console.log(data);
    // const sqls = `SELECT * FROM rooms WHERE roomId = ?;`
    // const [res] = await connections.execute(sqls, [data.roomId])
    // console.log(JSON.parse(res[0].chooseASongList));
    let chooseASongList = JSON.parse(res) || []
    // console.log(chooseASongList);
    //   if(chooseASongList){
    //     chooseASongList.push(data)
    //   }else{
    //     let chooseASongList = []
    chooseASongList.push(data)
 
    const sql = `update rooms set chooseASongList = ? where  roomId = ?`
    const [result] = await connections.execute(sql, [chooseASongList, data.roomId])
    //  console.log(result);
    // const red = await this.getChooseASong(data.roomId)
    //   }
    // console.log(chooseASongList);
    if (result)
      return chooseASongList
  }

  // 获取房间已点歌曲列表
  async getChooseASong(roomId) {
    const sqls = `SELECT chooseASongList FROM rooms WHERE roomId = ?;`
    const [res] = await connections.execute(sqls, [roomId])
    return res[0].chooseASongList
  }
  

  async deletePlayed(roomId) {
    const res = await this.getChooseASong(roomId)
    // console.log('删除了数据库');
    let chooseASongList = JSON.parse(res) 
    chooseASongList.shift()
    const sql = `update rooms set chooseASongList = ? where  roomId = ?`
    const [result] = await connections.execute(sql, [chooseASongList, roomId])
    const red = await this.getChooseASong(roomId)
    return red
  }

  async deleteSong(data,index) {
    const res = await this.getChooseASong(data.roomId)
    let chooseASongList = JSON.parse(res) 
    chooseASongList.splice(index, 1)
    const sql = `update rooms set chooseASongList = ? where  roomId = ?`
    const [result] = await connections.execute(sql, [chooseASongList, data.roomId])
    return result
  }
}
 
module.exports = new RoomService()