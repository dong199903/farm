// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    openid
  } = event
  try {
    return await db.collection('todos').where({
      done: true
    }).remove()
  } catch (e) {
    console.error(e)
  }
  return res
}