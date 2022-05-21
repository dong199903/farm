/*
 * @description: 
 * @author: 董泽平
 */
import Login from "./../../services/uses/login"
const app = getApp()
Page({
  data:{
    visible:false
  },
  /**我的地址 */
  address(){
    wx.navigateTo({
      url: './address/list/index'
    });
  },
  /**农业入驻 */
  farm(){

  },
  /**注册宣传 */
  zhengce(){
    
  },
  /**帮助中心 */
  help(){
    wx.navigateTo({
      url: './help/help'
    });
  },
  /**电话热线 */
  chat(){
    this.setData({
      visible:true
    })
  },
  /**注销退出 */
  exit(){

  },
  onCancel(){
    console.log('cancel')
    this.setData({
      visible:false
    })
  },
  /**
   * 电话客服
   */
  phone() {
    wx.makePhoneCall({
      phoneNumber: "18614235720"
    });
  },


  /**
   * 页面首次加载
   */
  onLoad() {
    let userInfo = app.globalData.userInfo
    console.log(userInfo)
    this.setData({
      userInfo: userInfo
    })
  },


  /** 登录-注册 */
  login() {
    let that = this
    wx.getUserProfile({
      desc: '微信授权',
      success: (res) => {
        console.log(res)
        app.globalData.userInfo = res.userInfo
        that.setData({
          userInfo: app.globalData.userInfo
        })
        Login(app.globalData.openid, app.globalData.userInfo)
      }
    })
  },

  /**
   * 获取用户头像，并注册
   */
   onChooseAvatar(e){
    const { avatarUrl } = e.detail 
    // this.setData({
    //   avatarUrl,
    // })
    console.log("选择头像",e)
   }

});