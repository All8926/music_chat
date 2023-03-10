const { Server } = require('socket.io')
const { message } = require('./tools/message');

const roomService = require('../service/room_service');
const userService = require('../service/user_service');
const messageService = require('../service/message_service')
const constancs = require('../constancs/index')

const { changeRoomLaterThings } = require('./tools/leaveRoom')

const io = new Server({
  cors: true
});

io.on("connection", (socket) => {

  socket.on('join', roomId => {
    roomService.updateRoomOnlineCount(roomId, 1)
    socket.join(roomId)
  })



  socket.on('changeRoom', async (data) => {

    socket.leave(data.oldRoom)
    socket.join(data.roomId)

    socket.roomId = data.roomId
    const [result] = await roomService.getRoomById(data.roomId)
    console.log('切换房间');
    // 是否为新创房间 
    if (!result.startTime) {
      let songList = JSON.parse(result.songList)
      let i = Math.floor(Math.random() * 20)
      let newTime = new Date().getTime()
      let obj = songList[i]
      console.log(obj);
      let currentindex = {
        startTime: newTime + 1000,
        index: i,
        play_url: null
      }

      let currentSong = { ...obj, ...currentindex }
      roomService.updateTime(currentSong, data.roomId)
      console.log('新创房间');
    }
    setTimeout(async () => {
      const [res] = await roomService.getRoomById(data.roomId)
      const roomCount = await roomService.updateRoomOnlineCount(data.oldRoom, -1)
      await roomService.updateRoomOnlineCount(data.roomId, 1)

      io.sockets.in(res.roomId).emit('getRoomSongInfo', res)

      changeRoomLaterThings(data.oldRoom, io)


    }, 500);

  })

  // 接收客户端聊天消息    
  socket.on('sendMessage', async (data) => {
    console.log(data);
    const result = await messageService.create(data)

    io.sockets.in(data[1].roomId).emit('messageReceived', data)
  })

  // 获取房间对应的歌曲信息
  socket.on('getRoomInfo', async (data) => {
    socket.username = data.username
    socket.userId = data.userId
    socket.roomId = data.roomId
    console.log(data.roomId);
    console.log(9696);
    const [result] = await roomService.getRoomById(data.roomId)
    console.log(result.roomId + ' 989898');
    io.sockets.in(result.roomId).emit('getRoomSongInfo', result)
  })

  // 获取在线用户列表
  socket.on('getOnlineUserList', async (data) => {
    await userService.updateOnline(data.userId, 1)

    const OnlineuserList = await userService.getUserListByRoomId(data.roomId)
    io.sockets.in(data.roomId).emit('getUserListByRoomId', OnlineuserList)

  })

  // 获取房间列表  
  socket.on('getRoomList', async () => {
    const roomList = await roomService.getRoomList()
    io.sockets.emit('getRoomList', roomList)

  })

  // 切歌
  socket.on('switchSong', async (data) => {
    const res = await roomService.getChooseASong(data.roomId)
    let random = Math.floor(Math.random() * 20)
    let newTime = new Date().getTime()

    const [result] = await roomService.getRoomById(data.roomId)
    let songList = JSON.parse(result.songList)
    if (JSON.parse(res).length) {
      console.log('不是空数组');
      random = 0,
        songList = JSON.parse(result.chooseASongList)
      const res = await roomService.deletePlayed(data.roomId)
      // console.log(res);
      io.sockets.in(data.roomId).emit('deletePlayed', res)
    }
    console.log(random + ' random 切歌');
    let currentindex = {
      startTime: newTime,
      index: random,
    }
    let obj = songList[random]
    let currentSong = { ...currentindex, ...obj }
    roomService.updateTime(currentSong, data.roomId)

  })

  // 投票切歌


  // 点歌
  socket.on('chooseASong', async (data) => {

    const res = await roomService.chooseASong(data)
    io.sockets.in(data.roomId).emit('chooseASong', res)
  })

  // 自动删除已点歌曲中的已播放歌曲
  socket.on('deletePlayed', async (data) => {
    console.log('删除');
    const res = await roomService.deletePlayed(data.roomId)
    io.sockets.in(data.roomId).emit('deletePlayed', res)

  })

  // 用户主动删除自己的已点歌曲
  socket.on('deleteSelectedSong', async (data, index) => {
    console.log('用户删除', index);
    if (data.userId !== socket.userId) {
      return
    }
    const res = await roomService.deleteSong(data, index)
    // console.log(res);
    io.sockets.in(data.roomId).emit('deleteSelectedSong', index)

  })

  const logOut = async () => {
    if (!socket.userId) {
      return
    }
    console.log('掉线了 ' + socket.userId);
    const result = await userService.updateOnline(socket.userId, 0)
    const red = await roomService.updateRoomOnlineCount(socket.roomId, -1)

    const res = await userService.getUserListByRoomId(socket.roomId)
    // console.log(result);   
    socket.leave(socket.roomId)
    io.sockets.in(socket.roomId).emit('getUserListByRoomId', res)
    changeRoomLaterThings(socket.roomId, io)

    let leavCcontent = {
      content: `用户 ${socket.username} 离开了房间`,
      time: new Date().getTime(),
      type: -1,
    };
    let userinfo = {
      userId: socket.userId,
      roomId: socket.roomId,
    }
    let arr = [leavCcontent, userinfo]
    message(socket, arr, io)
  }

  socket.on('logOut', async (data, index) => {
    logOut()

  })

  // 用户掉线
  socket.on('disconnect', async (data) => {
    logOut()
  })



});

module.exports = io 
