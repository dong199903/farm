// pages/ke/item/item.js
import article from "./../../../services/write/detail"
import dealTime from "./../../../utils/time"
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const {id} = options
    //根据id获取对应的文章
    const info = await article(id)
    let write = info.result.data[0]
    write.time = dealTime(write._updateTime)
    write.content  = write.content.replace(/\<img/gi, '<img class="rich-imgs" ');
    console.log(write)
    this.setData({
      info:write
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