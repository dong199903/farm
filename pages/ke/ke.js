/*
 * @description: 
 * @author: 董泽平
 */
// pages/ke/ke.js
Page({

  /**
   * 页面的初始数据
   */
   data: {
    current: 1,
    items: [
      {
        id:"1",
        info:"今日发生了重大的地则会那个，我都哦调动"
      },
      {
        id:"2",
        info:"学习初夏的大啊大大啊大大"
      }
    ],
  },
  
  onChange(e) {
    const {
      detail: { current, source },
    } = e;
    console.log(current, source)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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