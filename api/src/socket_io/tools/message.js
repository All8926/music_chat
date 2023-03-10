const messageService = require('../../service/message_service')

const message = async (socket,data,io) => {
  // console.log(data[1].roomId);
  
  // console.log(data);
  // if(data[0].type > 0){
    const result =  await messageService.create(data)
    // console.log(result);
  // }
  
//  console.log(socket.roomId,'socket.roomId');
//  console.log(data[1].roomId,'data[1].roomId');
  // console.log(data[1].roomId,'message');
  // console.log(data[0].type,'message.type');
  io.sockets.in(data[1].roomId).emit('messageReceived',data)
} 
    
module.exports = {
  message
}   