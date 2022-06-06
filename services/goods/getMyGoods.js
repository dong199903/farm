/*
获取个人发布所有的商品
*/
export default function(openid){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getMyGoods',
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