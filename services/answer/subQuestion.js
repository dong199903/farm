/*
 * @description: 
 * @author: 董泽平
 */
/**
 * 发布问题
 */
 export default function(request,openid){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'subAnswer',
      data:{
        request,openid
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}