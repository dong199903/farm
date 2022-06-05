/*
 * @description: 
 * @author: 董泽平
 */
/**
 * 获取第一条问题
 */
 export default function({_id,openid,val}){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'updateAnswer',
      data:{
        openid,_id,val
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}