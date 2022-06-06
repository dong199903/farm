/**
 * 获取对应店家的商品
 */
 export default function(openid){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getOrderByShop',
      data:{
        openid
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}