// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {openid} = event
  //1.聚合查询
  let res = await db.collection('farm_goods')
  .aggregate().match({   // 对主表accounts 添加筛选条件
    'openid': openid
  })
  .lookup({  // 左外连接副表users
    from:'farm_item',  
    localField: '_id', // 指定主表的关联字段
    foreignField: 'gid', // 指定副表的关联字段
    as: 'OrderList' // 把副表的查询结果放到userInfo对象里面
  })
  .end()
  res = res.list
  //2.遍历获取金钱
  let sum = 0
  for(let i=0;i<res.length;i++) {
    let list = res[i].OrderList
    for(let j=0;j<list.length;j++) {
      if(list[j].statue===3 || list[j].statue===4)
        sum += res[i].price * list[j].num
    }
  }
  return sum
}