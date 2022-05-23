
/*
 * @description: 获取具体的文章数据
 * @author: 董泽平
 */

 export default function(id){
   console.log("id",id)
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getWriteInfo',
      data:{
        _id:id
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}