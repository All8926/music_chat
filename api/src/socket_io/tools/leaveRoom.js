const roomService = require('../../service/room_service');
const constancs = require('../../constancs/index')

const  changeRoomLaterThings = async(roomId,io) =>{
  const [roomInfo] = await roomService.getRoomById(roomId)
  const flag =  constancs.NOTDELETEROOM.some(item => {
    return item === roomId
  })
  console.log(flag +' flag', roomId +" 旧房间" + roomInfo.onlineCount );
  if(roomInfo.onlineCount || flag){
    return console.log('没有删除房间'); 
  }
     const roomList = await roomService.deleteRoom(roomId)
    //  console.log(roomList);
     io.sockets.emit('getRoomList',roomList) 
}

module.exports = {
  changeRoomLaterThings
}