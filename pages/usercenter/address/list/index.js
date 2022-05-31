/* eslint-disable no-param-reassign */
/**
 * 
 * 用户的地址
 * 购物车
 * 账户信息userinfo openid都保存在localstorage中
 * 
 */
Page({
  /**保存收获地址的状态*/
  onLoad(option){
    let {statue} = option
    console.log(statue)
    this.setData({
      statue
    })
  },
  /**获取地址信息 */
  back(e){
    let addr = wx.getStorageSync('address')[e.currentTarget.dataset.index]
    console.log(addr)
    if(this.data.statue){ 
      //全局保存当前的收获地址
      wx.setStorageSync("goods_address",addr)
      //返回上一层
      wx.navigateBack({
        delta: 1
      });
    }
  },
  /**跳转到编辑页面 */
  edit: function (e) {
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: './../edit/index?id=' + id,
    })
  },
  /**新建收获地址 */
  createAddr: function () {
    wx.navigateTo({
      url: './../edit/index',
    })
  },
  /**微信地址导入保存到localStorage */
  wechatAdd: function () {
    let that = this
    wx.chooseAddress({
      success(res) {
        //1.先取出数据，然后添加
        let data = wx.getStorageSync('address')
        let obj = {}
        obj.userName = res.userName
        obj.address = res.provinceName + res.cityName + res.countyName 
        obj.detail = res.detailInfo
        obj.phone = res.telNumber
        data.unshift(obj)
        console.log(data)
        //2.存储到localStorage,同步更新页面data
        wx.setStorageSync('address', data)
        that.setData({
          address: data
        })
      }
    })
  },
  /**加载所有地址，进行渲染 */
  onShow() {
    let that = this
    wx.getStorage({
      key: 'address',
      success(res) {
        console.log(res)
        that.setData({
          address: res.data
        })
        console.log(that.data)
      },
      fail(res) {
        //如果没有获取到,设置初始的是[]
        wx.setStorageSync('address', [])
        that.setData({
          address: []
        })
      }
    })
  },
  data: {
    address: []
  }
});