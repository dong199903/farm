/*
 * @description: 
 * @author: 董泽平
 */
/**
 * 获取所有的问题
 *  */
 export default function(){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getAnswerAll'
      
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}