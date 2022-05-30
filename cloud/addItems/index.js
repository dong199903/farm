// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 模拟订单数据的插入
function addItem (oid,goodsList) {
  let res = []
  return new Promise((resolve,reject)=>{
    for(let i=0;i<goodsList.length;i++) {
      db.collection("farm_item").add({
        data:{
          oid,
          commit:false,
          num:goodsList[i].count,
          gid:goodsList[i]._id
        }
      }).then(msg=>{
        res.push(msg)
        if(res.length===goodsList.length) resolve(res)
      })
    }
    
  })
}
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {oid,goodsList} = event
  return await addItem(oid,goodsList)
}