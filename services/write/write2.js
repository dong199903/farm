/*
 * @description: 
 * @author: 董泽平
 */

/**
 * 获取
 */
 export default function(){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getHisList'
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}