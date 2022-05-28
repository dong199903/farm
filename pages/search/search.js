// pages/search/search.js
import search from '../../services/search/index'
import Toast from 'tdesign-miniprogram/toast/index';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchStatus: false,
    index1: 0,
    index2: 0,
    array1: ['全部', '蔬菜', '水果', '小吃', '美食', '鲜肉'],
    array2: ['全部', '0~100', '100~300', '300~500', '500~'],
    sid: ['16db756f627f521e02a4315750125c70', '0ab5303b627f53b9037d3286620071bb', '6d85a2b9627f53ed04119fd9482d8b38', 'f6e08a64627f54270309b95f294f50b2', 'f6e08a64627f54410309c59818b94b7e'],
    goodsList: [],
    showList: [],
  },
  changeGoodsShow: function () {
    let temp = []
    if (this.data.index1 == 0 && this.data.index2 == 0) {
      temp = this.data.goodsList
    } else if (this.data.index1 == 0) {
      temp = this.data.goodsList.filter(i => {
        if (this.data.index2 == 1 && (i.price < 100 && i.price >= 0)) {
          return true
        } else if (this.data.index2 == 2 && (i.price < 300 && i.price >= 100)) {
          return true
        } else if (this.data.index2 == 3 && (i.price < 300 && i.price >= 500)) {
          return true
        } else if (this.data.index2 == 4 && (i.price > 500)) {
          return true
        }
      })
    } else if (this.data.index2 == 0) {
      temp = this.data.goodsList.filter(i => {
        if (i.sid == this.data.sid[this.data.index1 - 1]) {
          return true
        }
      })
    } else {
      temp = this.data.goodsList.filter(i => {
        if (i.sid == this.data.index1) {
          if (this.data.index2 == 1 && (i.price < 100 && i.price >= 0)) {
            return true
          } else if (this.data.index2 == 2 && (i.price < 200 && i.price >= 100)) {
            return true
          } else if (this.data.index2 == 3 && (i.price < 300 && i.price >= 200)) {
            return true
          } else if (this.data.index2 == 4 && (i.price < 400 && i.price >= 300)) {
            return true
          } else if (this.data.index2 == 5 && (i.price > 500)) {
            return true
          }
        }
      })
    }
    this.setData({
      showList: temp
    })
  },
  getGoodsList: async function (keyword) {
    const info = await search(keyword)
    if (info.result.res.data.length) {
      this.setData({
        goodsList: info.result.res.data,
        showList: info.result.res.data,
        searchStatus: true
      })
    } else {
      this.setData({
        goodsList: [],
        showList: [],
        searchStatus: false
      })
      this.showErrorToast()
    }
  },
  getSearchResult: function (keyword) {
    if (keyword == '') {
      this.setData({
        searchStatus: false
      })
      this.showErrorToast()
      return false
    }
    this.setData({
      keyword: keyword,
      goodsList: []
    });
    this.getGoodsList(keyword);
  },
  onKeywordConfirm: function (e) {
    this.getSearchResult(e.detail.value);
    this.setData({
      index1: 0,
      index2: 0
    })
  },
  bindPickerChange1: function (e) {
    this.setData({
      index1: e.detail.value
    })
    this.changeGoodsShow()
  },
  bindPickerChange2: function (e) {
    this.setData({
      index2: e.detail.value
    })
    this.changeGoodsShow()
  },
  showErrorToast: function () {
    wx.showToast({
      title: "没有查询结果",
      icon: 'error', //图标，支持"success"、"loading" 
      mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false 
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      index: 0
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