// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {_id} = event
  return await db.collection("farm_item").doc(_id).update({
    data:{
      commit:true
    }
  })
}