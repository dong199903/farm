/**
 * 订单数据建立
 * 
 */
import OrderList from "./orderList"
 export default  function(openid,goodsList,goodsAddress){
  return new Promise(async(resolve,reject)=>{
    //1.订单表创建完成后，返回的id继续操作
    let info = await OrderList(openid)
    let _id = info.result._id
    console.log(_id)
    //2.将所有商品添加到订单中,每个订单添加收货信息
    wx.cloud.callFunction({
      name:'addItems',data:{
        oid:_id,
        goodsList,
        addr:goodsAddress
      }
    }).then(msg=>{
      resolve(msg)
    }).catch(err=>{
      reject(err)
    })
  })
}