
export default function(){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name: 'getOpenId'
    }).then(msg=>{
      resolve({
        code:200,
        msg:msg.result.openid
      })
    }).catch(err=>{
      reject({
        code:404,
        msg:err
      })
    })
  })
}