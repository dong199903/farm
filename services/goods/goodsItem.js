/*
 * @description: 
 * @author: 董泽平
 */
/**
 * 获取用户商品详情。
 * id:商品携带的id
 * 
 */
 export default function(id){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getGoodsInfo',
      data:{
        id
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}