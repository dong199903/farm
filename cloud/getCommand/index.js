<<<<<<< HEAD
/*
 * @description: 
 * @author: 董泽平
 */
/*
 * @description: 
 * @author: 董泽平
 */
=======
>>>>>>> 2d2a8ad7e602d9d9c9152c96a7f22b2cdf9c8d54
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //获取热门推荐
  return await db.collection('farm_goods').where({
<<<<<<< HEAD
    show:true,
    hot:true
=======
    hot:"1"
>>>>>>> 2d2a8ad7e602d9d9c9152c96a7f22b2cdf9c8d54
  }).get()
  
}