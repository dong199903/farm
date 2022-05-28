// pages/goods/goods.js
import getGoodsInfo from "./../../services/goods/goodsItem"

Page({
  data: {
    loading: true,
    good: {}
  },
  handleCartAdd: function () {
    // 1. 获取当前good对象
    let goodsObj = this.data.good
    // 2. 获取缓存的购物车或者数组
    let cart = wx.getStorageSync("cart") || []
    let index = cart.findIndex((item) => item._id === goodsObj._id)
    // 3. 判断当前good是否在购物车中：
    if (index === -1) {
      // 不在购物车中，添加到购物车中
      goodsObj.count = 1
      goodsObj.checked = false
      cart.push(goodsObj)
      // 4. 把购物车重新添加到缓存
      wx.setStorageSync('cart', cart)
      // 5. 弹窗提示
      wx.showToast({
        title: '加入成功',
        icon: 'success',
        mask: true
      })
    } else {
      wx.showToast({
        title:"已添加购物车"
      })
    }
  },
  skipToCart: function () {
    wx.switchTab({
      url: '/pages/cart/index'
    })
  },
  /**立即购买-商品的id直接生成订单 */
  buy(e){
    wx.navigateTo({
      url: '/pages/order/order_pay/order_pay?gid='+e.currentTarget.dataset.gid
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const {
      id
    } = options
    let info = await getGoodsInfo(id)
    console.log(info.result.data[0]);
    //获取商品信息
    this.setData({
      good: info.result.data[0],
      loading: false
    })
  },
})