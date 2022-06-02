/**获取第一条评论 */
 export default function(gid){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getCommentOne',
      data:{
        gid
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}