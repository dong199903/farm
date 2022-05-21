export default function(openid,userInfo){
  return new Promise((resolve,reject)=>{
    //开启loading
    console.log()
    wx.showLoading({
      title: 'loading...',
    });
    wx.cloud.callFunction({
      name:"login",
      data:{
        userInfo:userInfo,
        openid:openid
      }
    }).then(msg=>{
      wx.hideLoading()
      resolve(msg)
    }).catch(err=>{
      wx.hideLoading()
      reject(err)
    })
  })
  
}