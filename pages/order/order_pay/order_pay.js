// pages/order/order_pay/order_pay.js
import getGoodsInfo from "./../../../services/goods/goodsItem"
import subMessage from "./../../../services/sub/index"
import dealOrders from "./../../../services/order/item"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addr:null,
    goodsList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    console.log("onload")
    const gid = options?.gid
    //获取收获地址信息
    let addr = wx.getStorageSync("goods_address");
    this.setData({
      addr,
      gid
    })
    //商品的直接购买
    console.log(gid)
    if(gid) {
      let info = await getGoodsInfo(gid)
      let data = info.result.data[0]
      data.count = 1//货品的个数
      let list = this.data.goodsList
      list.push(data)
      console.log(list)
      this.setData({
        goodsList:list
      })
    }else {
      //商品通过购物车购买
      let car = wx.getStorageSync("cart")
      this.setData({
        goodsList:car
      })
    }
    let sum = 0
    let count = 0
    this.data.goodsList.forEach(element => {
      sum += element.price * element.count
      count += element.count
    });
    console.log(count,sum)
    this.setData({
      sum,
      count
    })
  },
  /**发布订阅消息 */
  sub(){
    //title,price,info
    let title = this.data.goodsList[0].title+"等商品"
    let price = this.data.sum
    let info = "具体情况，请前往小程序查看"
    console.log(this.data.goodsList)
    //订单的保存
    dealOrders(wx.getStorageSync("users").openid,this.data.goodsList)

    subMessage(title,price,info)
    //清空缓存购物车中选中的商品
    if(!this.data.gid){
      let car = wx.getStorageSync("cart")
      let res = []
      car.forEach(item=>{
        if(item.checked===false) res.push(item) 
      })
      wx.setStorageSync('cart',res)
    }
    
    //继续发起支付,跳转支付信息页面
    wx.navigateTo({
      url:"/pages/order/order_result/order_result?sum="+this.data.sum
    })
  },

  /**添加收获地址页面跳转 */
  addAddr(){
    wx.navigateTo({
      url: './../../usercenter/address/list/index?statue=1'
    });
  }
})