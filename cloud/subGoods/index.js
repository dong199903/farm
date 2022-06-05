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
  const {title,address,desc,price,imgs,video,sid,num,phone,openid} = event
  return await db.collection("farm_goods").add({
    data:{
      title,
      address,desc,price,imgs,video,sid,num,hot:true,show:true,phone,openid
    }
  })
}