/*
 * @description: 
 * @author: 董泽平
 */
/**
 * 获取分类下所有商品
 * sid:分类id
 * 
 */
 export default function(sid){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getGoodsList',
      data:{
        sid
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}