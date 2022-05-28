// pages/order/order_pay/order_pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addr:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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