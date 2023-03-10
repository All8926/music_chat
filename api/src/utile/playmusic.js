
const roomService = require('../service/room_service')
const axios = require('axios')

const getSongList = async (topId) => {
  let songList = []
  const { data: res } = await axios({
    method: 'get',
    baseURL: 'http://106.52.124.230:7000/v1/qq/top?topId=27&limit=30',
    headers: {
      'Content-Type': 'application/json',
    }
  })

  const { songInfoList } = res.detail.data
  songInfoList.forEach(item => {
    let songInfo = {
      mid: item.mid,
      song_name: item.title,
      singer_name: item.singer[0].name,
      isvip: item.pay.pay_play,
      song_img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.album.mid}.jpg`,
      time_length: item.interval
    }
    songList.push(songInfo)
  });
  setTimeout(() => {
    roomService.updatSong(songList)
  }, 100);
}
getSongList()

const playSongs = async (roomId) => {
  console.log(roomId + 'roomId');
  const newdate = new Date().getTime()

  function switchSong(t) {
    // 获取已点歌曲
    let getchooseASongList = []
    roomService.getChooseASong(roomId).then(red => {
      getchooseASongList = JSON.parse(red)
    })

    roomService.getRoomById(roomId).then((res) => {
      let result = res[0]
      let songList = JSON.parse(result.songList)
      let timeid
      let random = Math.floor(Math.random() * 20)
      let newTime = new Date().getTime()
      let startTime = parseInt(JSON.parse(result.startTime).startTime / 1000)
      let time_length = JSON.parse(result.startTime).time_length
      if (getchooseASongList.length) {
        random = 0
        songList = getchooseASongList
      }
      let obj = songList[random]

      let currentindex = {
        startTime: newTime,
        index: random,
      }

      let currentSong = { ...obj, ...currentindex }
      clearTimeout(timeid);
      if (t - (startTime + parseInt(time_length / 1000)) !== 0 && t) {
        timeid = setTimeout(() => {
          switchSong(parseInt(newTime / 1000) + (parseInt(time_length / 1000) - (parseInt(newTime / 1000) - startTime)))
        }, time_length - ((parseInt(newTime / 1000) - startTime) * 1000));
      } else {
        roomService.updateTime(currentSong, roomId)
        timeid = setTimeout(() => {
          switchSong(parseInt(newTime / 1000) + parseInt(songList[random].time_length / 1000))
        }, songList[random].time_length * 1000);
      }
    })
  }
  switchSong()

}

module.exports = { playSongs, getSongList }


