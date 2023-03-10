const dotenv = require('dotenv')
dotenv.config()


const fs = require('fs')
const path = require('path')

const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, './key/private.key'))
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, './key/public.key'))
// console.log(process.env.APP_PORTA);

// 拿到的是buffer类型，转为字符串类型
module.exports.PRIVATE_KEY = PRIVATE_KEY.toString()
module.exports.PUBLIC_KEY = PUBLIC_KEY.toString()