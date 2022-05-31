/**
 * 更新评论状态
 */
 export default function(_id){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'updateCommit',
      data:{
        _id
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}