// pages/goods/commit/commit.js
import getComments from "./../../../services/comment/getCommentAll"
import timeDeal from "./../../../utils/timeDeal"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true
  },

  /**
   * 获取对应商品的所有评论+个人信息
   */
  async onLoad(options) {
    const {gid} = options
    console.log(gid)
    //加载所有评论
    let info = await getComments(gid)
    console.log(info)
    let infos = info.result.list
    //处理所有的时间
    infos.forEach(item=>{
      let {year,month,day,hour,minutes} = timeDeal(item.time)
      item.time = `${year}/${month}/${day} ${hour}:${minutes}`
    })
    console.log(infos)
    this.setData({
      commit:infos,
      loading:false
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