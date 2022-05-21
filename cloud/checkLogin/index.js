// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let { openid} = event
  console.log("cloud",openid)
  
  let res = await db.collection('farm_user').where({
    openid:_.eq(openid)
  }).get()
  return {
    res
  }
}