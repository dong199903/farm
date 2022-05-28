// pages/order/order_pay/order_pay.js
import getGoodsInfo from "./../../../services/goods/goodsItem"
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
    const {gid} = options
    //获取商品的具体信息
    if(gid) {
      let info = await getGoodsInfo(gid)
      let data = info.result.data[0]
      data.total = 1//货品的个数
      let list = this.data.goodsList
      list.push(data)
      console.log(list)
      this.setData({
        goodsList:list
      })
    }else {
      //通过购物车添加
    }
    let sum = 0
    let count = 0
    this.data.goodsList.forEach(element => {
      sum += element.price * element.total
      count += element.total
    });
    console.log(sum)
    this.setData({
      sum,
      count
    })

    
  },
  sub(){
    let openid = wx.getStorageSync("users").openid
    console.log("openid",openid)
    wx.requestSubscribeMessage({
      tmplIds: ['aSsTGj49jKWfW3g5HLqrJkoZbWSu7wZW51tqb25dhq4'],
      success (res) { 
        //发布云函数的订阅
        wx.cloud.callFunction({
          name:"sub",
          data:{
            openid:openid
          }
        }).then(msg=>{
          console.log(msg)
        })
      },
      fail(res){
        console.log(res)
      }
    })
  },

  /**添加收获地址页面跳转 */
  addAddr(){
    wx.navigateTo({
      url: './../../usercenter/address/list/index?statue=1'
    });
  },
  /**
   *
   */
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //获取收获地址信息
    let addr = wx.getStorageSync("goods_address");
    this.setData({
      addr
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})