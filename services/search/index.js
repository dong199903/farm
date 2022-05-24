export default function(keyword){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'search',
      data:{
        keyword
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}