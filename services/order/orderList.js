/**
 * 订单数据建立
 * 
 */
 export default function(openid){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'addOrder',
      data:{
        openid,
        time:Date.now()
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}