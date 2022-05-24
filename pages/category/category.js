/*
 * @description: 
 * @author: 董泽平
 */
// pages/category/category.js
<<<<<<< HEAD
import goodsList from "./../../services/goods/goodsList"
=======
import getGoodsByCid from '../../services/goods/getGoodsByCid'
>>>>>>> 2d2a8ad7e602d9d9c9152c96a7f22b2cdf9c8d54
Page({

  /**
   * 页面的初始数据
   */
  data: {
<<<<<<< HEAD
    loading:true
  },
   

=======
    
  },
  goSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
>>>>>>> 2d2a8ad7e602d9d9c9152c96a7f22b2cdf9c8d54
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
<<<<<<< HEAD
    let _id = options._id
    console.log(_id)
    let goods = await goodsList(_id)
    this.setData({
      goods:goods.result.data,
      loading:false
=======
    const {id, title} = options
    let info = await getGoodsByCid(id)
    console.log(info.result.res.data);
    this.setData({
      goods: info.result.res.data,
      title: title
>>>>>>> 2d2a8ad7e602d9d9c9152c96a7f22b2cdf9c8d54
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