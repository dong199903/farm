/*
 * @description: 
 * @author: 董泽平
 */
/**
 * 通知信息
 * 
 */
 export default function(){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getNotice'
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}