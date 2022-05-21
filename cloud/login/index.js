// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {openid,userInfo} = event
  db.collection('farm_user').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      openid,
      userInfo
    }
  })
  .then(res => {
    return {
      code:200
    }
  })
  .catch(err=>{
    return {
      code:404
    }
  })
}