// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {openid,value,time,gid} = event
  //1.添加评论
  return db.collection("farm_commit").add({
    data:{
      openid,
      value,time,gid
    }
  })
}