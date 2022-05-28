// pages/cart/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    allChecked: false, // 全选
    goodsList: [], // 购物车商品
    totalPrice: 0.00, // 总价格
  },
  getCartStorage: async function () {
    await wx.getStorage({
      key: 'cart',
      success: (res) => {
        this.setData({
          goodsList: res.data
        })
      },
      fail: (err) => {}
    })
  },
  // 更新缓存
  setCartStorage: function () {
    let goodsList = this.data.goodsList
    wx.setStorageSync('cart', goodsList)
  },
  // 统计总价
  getTotalPrice: function () {
    // 获取购物车列表
    let goodsList = this.data.goodsList
    let totalPrice = 0
    // 循环列表
    for (let i = 0; i < goodsList.length; i++) {
      // 判断选中才会计算价格
      if (goodsList[i].checked) {
        // 所有价格加起来
        totalPrice += goodsList[i].count * goodsList[i].price
      }
    }
    // 赋值到data中渲染到页面
    this.setData({
      goodsList: goodsList,
      totalPrice: totalPrice.toFixed(2)
    });
  },
  // 选择事件
  selectList: function (e) {
    // 获取data- 传进来的index
    let index = e.currentTarget.dataset.index;
    // 获取购物车列表
    let goodsList = this.data.goodsList;
    // 获取当前商品的选中状态
    let checked = goodsList[index].checked;
    console.log(checked);
    // 改变状态
    goodsList[index].checked = !checked;
    this.setData({
      goodsList: goodsList
    });

    // 改变全选状态
    for (var i = 0; i < this.data.goodsList.length; i++) {
      // 当状态为全选时，每个元素其中有一个为false，则取消全选
      // 当状态为非全选时，每个元素都为true，则全选
      if (this.data.allChecked) {
        if (!this.data.goodsList[i].checked) {
          this.setData({
            allChecked: false
          });
          break;
        }
      } else {
        if (this.data.goodsList[i].checked) {
          this.setData({
            allChecked: true
          });
        } else {
          this.setData({
            allChecked: false
          });
          break;
        }
      }
    }
    // 重新统计总价
    this.getTotalPrice();
  },

  // 全选事件
  selectAll: function (e) {
    // 是否全选状态
    let allChecked = this.data.allChecked;
    allChecked = !allChecked;
    let goodsList = this.data.goodsList;
    for (let i = 0; i < goodsList.length; i++) {
      // 改变所有商品状态
      goodsList[i].checked = allChecked;
    }
    this.setData({
      allChecked: allChecked,
      goodsList: goodsList
    });
    // 重新统计总价
    this.getTotalPrice();
  },
  // 增加数量
  addCount: function (e) {
    let index = e.currentTarget.dataset.index;
    let goodsList = this.data.goodsList;
    let count = goodsList[index].count;
    count = count + 1;
    goodsList[index].count = count;
    this.setData({
      goodsList: goodsList
    });
    // 重新统计总价
    this.getTotalPrice();
  },
  // 减少数量
  minusCount: function (e) {
    let index = e.currentTarget.dataset.index;
    let goodsList = this.data.goodsList;
    let count = goodsList[index].count;
    if (count <= 1) {
      wx.showToast({
        title: '宝贝不能再减少啦',
        icon: 'none'
      })
      return false;
    }
    count = count - 1;
    goodsList[index].count = count;
    this.setData({
      goodsList: goodsList
    });
    // 重新统计总价
    this.getTotalPrice();
  },
  // 输入数量
  inputCount: function (e) {
    let index = e.currentTarget.dataset.index;
    let goodsList = this.data.goodsList;
    let count = e.detail.value;
    goodsList[index].count = count;
    this.setData({
      goodsList: goodsList
    });
    // 重新统计总价
    this.getTotalPrice();
  },
  // 失去焦点时判断数量是否小于1
  bindblur(e) {
    let index = e.currentTarget.dataset.index;
    let goodsList = this.data.goodsList;
    let count = e.detail.value;
    if (count < 1) {
      wx.showToast({
        title: '数量不能小于1',
        icon: 'none'
      })
      count = 1;
      goodsList[index].count = count;
      this.setData({
        goodsList: goodsList
      });
      // 重新统计总价
      this.getTotalPrice();
    }
  },
  handleStepperChange: function (e) {
    let index = e.detail.index
    let goodsList = this.data.goodsList
    console.log(goodsList);
    goodsList[index].count = e.detail.value
    this.setData({
      goodsList: goodsList
    })
  },
  skipToPay: function () {
    // 跳转结算页面
    wx.navigateTo({
      url: '/pages/pay/pay'
    })
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
    this.getCartStorage()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.setCartStorage()
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