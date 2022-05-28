/*
 * @description: 
 * @author: 董泽平
 */
// pages/goods/goods.js
import getGoodsInfo from "./../../services/goods/goodsItem"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true
  },
  handleCartAdd: function () {
    // 1. 获取当前good对象
    let goodsObj = this.data.goods
    // 2. 获取缓存的购物车或者数组
    let cart = wx.getStorageSync("cart") || []
    let index = cart.findIndex((item) => item._id === goodsObj._id)
    // 3. 判断当前good是否在购物车中：
    if (index === -1) {
      // 不在购物车中，添加到购物车中
      goodsObj.num = 1
      goodsObj.checked = false
      cart.push(goodsObj)
    } else {
      // 如果在购物车中，数量加1
      cart[index].num++;
    }
    // 4. 把购物车重新添加到缓存
    wx.setStorageSync('cart', cart)
    // 5. 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    })
  },
  handleSkipCart: function () {
    wx.switchTab({
      url: '/pages/cart/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const {
      id
    } = options
    let info = await getGoodsInfo(id)
    //获取商品信息
    this.setData({
      goods: info.result.data[0],
      loading: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

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