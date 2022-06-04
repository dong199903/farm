// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const {openid,request} = event
  return db.collection("farm_answer").add({
    data:{
      request,
      request_id:openid,
      answer:"",
      response_id:"",
      time:Date.now()
    }
  })
}