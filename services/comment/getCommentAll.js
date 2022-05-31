
/**
 * 获取对应商品的所有评论
 */
 export default function(gid){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getCommentAll',
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