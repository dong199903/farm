/*
 * @description: 
 * @author: 董泽平
 */
/*
 * @description: 
 * @author: 董泽平
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await db.collection("farm_write").where({
    sid:2
  }).limit(2).get()
}