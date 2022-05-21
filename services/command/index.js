/*
 * @description: 
 * @author: 董泽平
 */
/**
 * 获取首页的热门推荐列表
 */
 export default function(){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getCommand'
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}