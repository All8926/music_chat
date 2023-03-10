const app = require('./src/app/index')
const io = require('./src/socket_io/index')




require('./src/app/database')
require('./src/socket_io/index')
const play = require('./src/utile/playmusic')
const messageService = require('./src/service/message_service')

// 定时删除提示消息
setInterval( async() => {
  const res = await messageService.deleteMessage(-1)
  play.getSongList()
  // console.log(res);
}, 1000 * 60 * 60 * 12);

app.listen(3100, () => {
  play.playSongs(888)
  console.log('3100服务器响应成功');
});
io.listen(5000,() => {
  console.log('socket666');
});