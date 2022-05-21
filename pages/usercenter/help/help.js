import suggest from "./../../../services/uses/suggest"
const app = getApp()
import Dialog from 'tdesign-miniprogram/dialog/index';
// pages/usercenter/help/help.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    originFiles: [],
    gridConfig: {}
  },
  getInfo(e) {

    this.setData({
      info: e.detail.value
    })
  },
  getName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  getTel: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  handleSucces: function (e) {
    console.log(e)
    this.setData({
      files: e.detail.files
    })
  },
  /**上传图片 */
  uploadImg: function () {
    let imgs = []
    let that = this
    console.log(that.data.files)
    return new Promise((resolve, reject) => {
      for (let i = 0; i < that.data.files.length; i++)
        wx.cloud.uploadFile({
          cloudPath: 'farm/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + ".jpg", //使用时间戳加随机数作为上传至云端的图片名称
          filePath: that.data.files[i].url, // 本地文件路径
          success: res => {
            imgs.push(res.fileID)
            if (imgs.length === that.data.files.length) resolve(imgs)
          },
          fail: function (err) {
            reject(err)
          }
        })
    })
  },
  /**提交意见--保存到云数据库 */
  submit: async function () {
    let res = await this.uploadImg()
    let info = {}
    info.name = this.data.name
    info.phone = this.data.phone
    info.info = this.data.info
    info.imgs = res
    let msg = await suggest(app.globalData.openid, info)
    if (msg.code === 103)
      Dialog.alert({
        title: 'message',
        content: '留言成功',
        confirmBtn: '确定',
      }).then(() => {
        wx.navigateBack()
      });
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