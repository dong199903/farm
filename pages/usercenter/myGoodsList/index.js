// pages/usercenter/myGoodsList/index.js
import getMyGoods from "./../../../services/goods/getMyGoods"
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let openid = app.globalData.openid
    let info = await getMyGoods(openid)
    this.setData({
      loading:false,
      goods:info.result.data
    })
  },
  goGoodsDetail(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goods/goods?id='+id
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  }
})