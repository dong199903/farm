/**
 * 热门推荐。
 * count:每次加载的数据个数
 * 
 */
 export default function(){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getCommand',
      data:{
        count:20
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}