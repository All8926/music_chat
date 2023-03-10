const mysql = require('mysql2')

const connections = mysql.createPool({
  host:'localhost',
  port:3306,
  database:'music_what',
  user:'root',
  password:'a3181389202.'
})

connections.getConnection((err,conn) => {
  conn.connect((err) => {
    if(err){
       console.log('mysql连接失败');
    }else{
      console.log('mysql连接成功');
    }
  
  })
})

module.exports = connections.promise()