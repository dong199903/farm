// pages/ke/answer/answer.js
import subAnswer from "./../../../services/answer/subQuestion"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subBox:false,
    value:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  /**获取输入框内容 */
  input(e){
    this.setData({
      value:e.detail.value
    })
  },
  /**关闭发布问题的弹窗 */
  closeSub(){
    console.log("close")
    this.setData({
      subBox:false
    })
  },
  /**发布问题显示 */
  subShow(){
    this.setData({
      subBox:true
    })
  },
  /**发布问题 */
  async subQues(){
    let val = this.data.value
    console.log(val)
    if(!val) wx.showToast({
      title: '内容不能是空',
      icon: 'none',
      image: '',
      duration: 1500,
      mask: false
    });
    else {
      let openid = wx.getStorageSync("users").openid;
      let info = await subAnswer(val,openid)
      console.log(info)
      wx.showToast({
        title: '发布成功',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false
      })
      //将最新的发布内容插入头部
      
    }
    this.setData({
      subBox:false
    })
  },
  /**回答问题显示 */
  /**回答问题 */
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