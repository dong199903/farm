/**
  订单的发货处理
 */
 export default function(id,statue){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'updateStatue',
      data:{
        id,statue
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}