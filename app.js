import getOpenId from "./services/uses/getOpenId"
import checkLogin from "./services/uses/checkLogin"
/**
 * 1.获取缓存数据，判断是否存在
 * 2.存在，直接全局赋值
 * 3.不存在，获取openid，判断是否注册。
 * 4.如果注册，获取信息，缓存起来
 * 5.没有注册，正常注册，缓存起来
 * 6.注销是，清空全局数据
 * 
 */
App({
  /**
   * 获取用户openid
   */
  getOpenId: function () {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getOpenId'
      }).then(msg => {
        resolve({
          code: 200,
          msg: msg.result.openid
        })
      }).catch(err => {
        reject({
          code: 404,
          msg: err
        })
      })
    })
  },

  onLaunch: async function () {
    wx.cloud.init({
      env: "www-9gbp0av65043db23",
      traceUser: true
    })
    //1.判断是否有缓存
    let users = wx.getStorageSync('users')
    if (users) {
      this.globalData.userInfo = users.userInfo
      this.globalData.openid = users.openid
      return
    }


    //2.无缓存，判断用户是否注册过
    let res = await getOpenId()
    if (res.code === 404) return
    this.globalData.openid = res.msg
    let isLogin = await checkLogin(this.globalData.openid)
    console.log(isLogin)
    //4.未注册，跳转登录页面
    if (isLogin.code !== 200) wx.reLaunch({
      url: '../../pages/usercenter/index',
    })
    //5.注册过，直接全局绑定数据
    if (isLogin.code === 200) {
      let users = {}
      users.userInfo = isLogin.msg.userInfo
      users.openid = isLogin.msg.openid
      wx.setStorageSync('users', users)
      this.globalData.openid = isLogin.msg.openid
      this.globalData.userInfo = isLogin.msg.userInfo
    }
  },
  globalData: {
    userInfo: null,
    openid: null
  }
});