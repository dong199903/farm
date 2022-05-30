// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //farm_order
  //farm_item
  //farm_goods
  const {openid} = event
  let orders = await db.collection('farm_order')
    .aggregate().match({   // 对主表accounts 添加筛选条件
      'openid': openid
    })
    .lookup({  // 左外连接副表users
      from:'farm_item',  
      localField: '_id', // 指定主表的关联字段
      foreignField: 'oid', // 指定副表的关联字段
      as: 'OrderList' // 把副表的查询结果放到userInfo对象里面
    })
    .end()

  let goods = await db.collection("farm_goods").get()
  return {orders,goods}
}