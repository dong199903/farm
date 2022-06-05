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

  return Promise.all([db.collection('farm_notice').get(),db.collection("farm_write").orderBy("_updateTime","desc").where({
    hot:true
  }).limit(20).get(),db.collection("farm_answer").orderBy("time","desc").limit(1).get()])
}