// 封装buffer转字符串函数

const typeString = (arr) => {
  arr.forEach(item => {
    for (var i in item) {
      let value = item[i]
      if (Buffer.isBuffer(value)) {
        item[i] = item[i].toString()
      }

      if(Array.isArray(value) ){
       value.forEach(label => {
        for (var l in label) {
        }
      })
    }}
  });
  return arr
}

module.exports = typeString