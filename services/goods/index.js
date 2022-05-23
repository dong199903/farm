// 获取商品详情
export default function(id){
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'getGoodByGid',
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