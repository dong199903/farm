// pages/cart/index.js
let app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    allChecked: false, // 全选
    goodsList: [], // 购物车商品
    totalPrice: 0.00, // 总价格
  },
  /**
   * 获取购物车数据
   */
  onShow() {
    if(!app.globalData.userInfo) {
      wx.reLaunch({
        url: '/pages/usercenter/index',
      })
    } else {
      let goodsList = wx.getStorageSync("cart") || [];
      //判断全局状态和全局金钱
      let tmp = true
      let sum = 0
      for(let i=0;i<goodsList.length;i++) {
        if(goodsList[i].checked===false) {
          tmp = false
        } else sum += goodsList[i].price
      }
      this.setData({
        goodsList,
        allChecked:tmp,
        totalPrice:sum
      })
    }
  },
  // 更新缓存
  setCartStorage: function () {
    let goodsList = this.data.goodsList 
    wx.setStorageSync('cart', goodsList)
  },
  /**
   * 步进器发生改变
   * 1.如果数量是0，删除商品
   * 
   */
  handleChange(e){
    let value = e.detail.value
    let index = e.currentTarget.dataset.index
    let goodsList = this.data.goodsList;
    //数量是0，直接从购物车删除
    if(value==0) goodsList.splice(index,1)
    else goodsList[index].count = value;
    //判断当前是否是全选的状态
    let tmp = true//默认是全选
    goodsList.forEach(element => {
      if(element.checked===false) tmp = false
    });
    console.log(goodsList)
    this.setData({
      goodsList: goodsList,
      allChecked:tmp
    });
    // 重新统计总价
    this.getTotalPrice();
    // 同步缓存
    wx.setStorageSync("cart",goodsList)
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
    //更新缓存 
    wx.setStorageSync("cart",this.data.goodsList)
    // 重新统计总价
    this.getTotalPrice();
    console.log(wx.getStorageSync("cart"))
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
    //更新缓存 
    wx.setStorageSync("cart",this.data.goodsList)
    // 重新统计总价
    this.getTotalPrice();
  },
  


  /**结算页面跳转 */
  skipToPay: function () {
    if(parseInt(this.data.totalPrice)===0) wx.showToast({
      title: '请添加商品',
      icon: 'none',
      duration: 1500
    });
    else 
      wx.navigateTo({
        url: '/pages/order/order_pay/order_pay'
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  }

  
})