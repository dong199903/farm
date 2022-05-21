export default function(openid) {
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:"loginOut",
      data:{
        openid:openid
      }
    }).then(msg=>{
      resolve({
        code:101
      })
    }).catch(err=>{
      reject({
        code:404
      })
    })
  })
}