const axios = require('axios')

try {
  axios.defaults.timeout = 50000 * 1000;

 const getPlayUrlResult = async (mid) => {
    const {data:res} = await axios({
      method: 'get',
      baseURL: `http://106.52.124.230:7000/v1/qq/song?mid=${mid}`,     
      headers: {   
          'Content-Type':'application/json',
      } 
    })
    return res.data.url
 } 
 const getLyricResult = async (mid) => {
    const {data:res} = await axios.get(`http://106.52.124.230:7000/v1/qq/lyric?mid=${mid}`)
    return res.lyric
 }
 module.exports = { getPlayUrlResult, getLyricResult}
} catch (error) {
 return console.log(error);
}
 