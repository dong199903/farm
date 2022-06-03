// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {title} = event
  //返回结果
  return await db.collection("farm_write").where({
    title: db.RegExp({
      regexp: title,
      options: 'i'
    })
  }).get()
}