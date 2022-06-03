export default function(title){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'search_read',
      data:{
        title
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}