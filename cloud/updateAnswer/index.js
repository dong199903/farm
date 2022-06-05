// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {openid,_id,val} = event
  return await db.collection("farm_answer").doc(_id).update({
    data:{
      answer:val,
      response_id:openid
    }
  })
}