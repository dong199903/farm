import Login from "./../../services/uses/login"

const app = getApp()
Page({
  data:{
    visible:false
  },
  /**我的地址 */
  address(){
    if(!app.globalData.userInfo) {
      //提示进行登录
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false
      });
    } else {
      wx.navigateTo({
        url: './address/list/index'
      });
    } 
    
  },
  /**农业入驻 */
  farm(){
    if(!app.globalData.userInfo) {
      //提示进行登录
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false
      });
    } else {
      wx.navigateTo({
        url:"/pages/usercenter/bussiness/index"
      })
    }
    
  },
  /**政策宣传 */
  zhengce(){
    if(!app.globalData.userInfo) {
      //提示进行登录
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false
      });
    } else {
      wx.reLaunch({
        url: '/pages/ke/ke'
      })
    }
    
  },
  /**帮助中心 */
  help(){
    if(!app.globalData.userInfo) {
      //提示进行登录
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false
      });
    } else {
      wx.navigateTo({
        url: './help/help'
      });
    }
    
  },
  /**电话热线 */
  chat(){
    this.setData({
      visible:true
    })
  },
  /**跳转订单页面 */
  goOrder(e){
    if(!app.globalData.userInfo) {
      //提示进行登录
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false
      });
    } else {
      wx.navigateTo({
        url:"./../order/order?id="+e.currentTarget.dataset.id+"&title="+e.currentTarget.dataset.title
      })
    }
    
  },
  /**
   * 注销退出 
   * > 清空全局的userinfo.保存用户的openid
   * > 
   * 
  */
  exit(){
    console.log("注销操作")
    app.globalData.userInfo = null
    this.setData({
      userInfo:null,
      quit:true
    })
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
    if(this.data?.quit) {
      //可以直接从缓存中获取用户信息
      let {userInfo} = wx.getStorageSync('users');
      app.globalData.userInfo = userInfo
      this.setData({
        userInfo
      })

    } else {
      let that = this
      wx.getUserProfile({
        desc: '微信授权',
        success: (res) => {
          console.log(res)
          //保存全局数据
          res.userInfo.expert = false
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: app.globalData.userInfo
          })
          let obj = {}
          obj.userInfo = res.userInfo
          obj.openid = app.globalData.openid
          //缓存用户信息
          wx.setStorageSync("users", obj);
          //注册到数据库
          Login(app.globalData.openid, app.globalData.userInfo)
        }
      })
    } 
  },
});