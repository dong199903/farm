// pages/order/order_result/order_result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad(options) {
    const {sum} = options
    console.log(sum)
    this.setData({
      sum
    })
  },
  /**订单详情页面 */
  viewTips(){
    wx.navigateTo({
      url: '/pages/order/order'
    });
  },
  /**返回首页页面 */
  backHome(){
    wx.reLaunch({
      url: '/pages/home/home'
    })
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