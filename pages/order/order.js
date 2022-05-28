// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */

  data: {
    value:"1",
    tarbars:[
      {value:"1",content:"全部"},
      {value:"2",content:"待付款"},
      {value:"3",content:"待发货"},
      {value:"4",content:"待收货"},
      {value:"5",content:"待评价"},
      {value:"6",content:"退款/售后"}
    ]
  },
  onTabsChange(e) {
    console.log(e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let {id} = options
    console.log(id)
    this.setData({
      value:id
    })
    //获取所有的订单1类，然后分类5类
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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