/**
 * 获取所有的订单
 * 
 */

 export default  function(openid){
  return new Promise(async(resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getOrderList',data:{
        openid
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}