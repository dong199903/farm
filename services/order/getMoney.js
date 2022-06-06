/**
 * 获取赚取的金额
 */
 export default function(info){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getMoney',
      data:{
        openid:info.openid
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}