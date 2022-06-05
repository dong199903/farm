/*
 * @description: 
 * @author: 董泽平
 */
/**
 * 获取所有的问题
 *  */
 export default function(openid){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getAnswerAll',
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