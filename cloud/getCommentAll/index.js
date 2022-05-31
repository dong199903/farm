// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {gid} = event
  return db.collection("farm_commit").aggregate().match({   // 对主表accounts 添加筛选条件
    'gid': gid
  }).sort({
    time:-1
  })
  .lookup({  // 左外连接副表users
    from:'farm_user',  
    localField: 'openid', // 指定主表的关联字段
    foreignField: 'openid', // 指定副表的关联字段
    as: 'userInfo' // 把副表的查询结果放到userInfo对象里面
  })
  .end()
}