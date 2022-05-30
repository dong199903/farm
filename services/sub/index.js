/**
 * 发布订阅
 */
import timeDeal from "../../utils/timeDeal"
 export default function(title,price,info){
  let openid = wx.getStorageSync("users").openid
  let {year,month,day,hour,minutes,second} = timeDeal(Date.now())
  return new Promise((resolve,reject)=>{
    wx.requestSubscribeMessage({
      tmplIds: ['aSsTGj49jKWfW3g5HLqrJkoZbWSu7wZW51tqb25dhq4'],
      success (res) { 
        //发布云函数的订阅 编号，商品名称，时间，金额，其它
        try{
          wx.cloud.callFunction({
            name:"sub",
            data:{
              openid:openid,
              title,
              price,
              info,
              time:`${year}年${month}月${day}日 ${hour}:${minutes}`
            }
          }).then(msg=>{
            resolve(msg)
          })
        }catch(e){
          reject()
        }
      },
      fail(res){
        reject()
      }
    })
  })
}