/**
 * 发布评论
 */
 export default function(info){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'addCommit',
      data:{
        openid:info.openid,
        value:info.value,
        time:Date.now(),
        gid:info.gid
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}