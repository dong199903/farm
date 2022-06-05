/*
 * @description: 
 * @author: 董泽平
 */


 export default function(goods){
   let {title,desc,address,price,imgs,video,sid,num,phone,openid} = goods
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'subGoods',
      data:{
        title,
        desc,
        address,price,imgs,video,sid,num,phone,openid
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}