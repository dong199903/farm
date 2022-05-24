export default function(id){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getGoodsByCid',
      data:{
        id
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}