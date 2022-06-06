// pages/usercenter/bussiness/index.js
import getMoney from "../../../services/order/getMoney";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading:true
  },
  /**商家订单管理 */
  goGoodsItem(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/usercenter/manage/manage?id='+id
    });
  },
  /**跳转我的全部商品 */
  goMyGoodsAll(){
    wx.navigateTo({
      url: '/pages/usercenter/myGoodsList/index'
    });
  },
  /**发布商品 */
  addGoods(){
    wx.reLaunch({
      url: '/pages/submit/submit'
    });
  },
  onLoad(){
    let user = app.globalData.userInfo
    this.setData({
      user
    })
    console.log(user)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onShow(options) {
    //获取用户赚的金额globalData.userInfo
    let total = await getMoney(app.globalData.openid)
    this.setData({
      loading:false,total:total.result
    })
  }
})