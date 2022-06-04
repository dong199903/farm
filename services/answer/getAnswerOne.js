/*
 * @description: 
 * @author: 董泽平
 */
/**
 * 获取第一条问题
 */
 export default function(){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getAnswerOne'
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}