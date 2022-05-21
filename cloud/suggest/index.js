// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //添加用户建议
  const {
    openid,
    info
  } = event

  db.collection('farm_suggest').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      openid,
      info
    }
  }).then(msg => {
    return msg
  }).catch(err => {
    return err
  })
}