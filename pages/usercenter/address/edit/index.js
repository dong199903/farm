import Toast from 'tdesign-miniprogram/toast/index';
import Dialog from 'tdesign-miniprogram/dialog/index';
Page({
  
  /**获取传递的参数 */
  onLoad: function (option) {
    let id = option?.id
    console.log(id)
    if (id) {
      id = parseInt(id)
      let addr = wx.getStorageSync("address")[id]
      this.setData({
        addr: addr,
        id:id,
      })
    } else {
      this.setData({
        addr: {},
        id:null
      })
    }
  },
  /**通过地图选择位置 */
  map: function () {
    let that = this
    wx.chooseLocation({
      success: function (res) {
        //更新数据
        let addr = that.data.addr
        addr.address = res.address
        that.setData({
          addr: addr
        })
      }
    })
  },
  getName: function (e) {
    let addr = this.data.addr
    addr.userName = e.detail.value
    this.setData({
      addr: addr
    })
  },
  getPhone: function (e) {
    let addr = this.data.addr
    addr.phone = e.detail.value
    this.setData({
      addr: addr
    })
    
  },
  getDor: function (e) {
    let addr = this.data.addr
    addr.detail = e.detail.value
    this.setData({
      addr: addr
    })
  },
  getAddress: function (e) {
    let addr = this.data.addr
    addr.address = e.detail.value
    this.setData({
      addr: addr
    })
  },
  /**保存地址到localStorage */
  sub: function () {
    let that = this
    if (!this.data.addr.userName) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请输入姓名',
        theme: 'success',
      });
      return
    }
    if (!this.data.addr.phone) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请输入手机号',
        theme: 'success',
      });
      return
    }
    if (!this.data.addr.address) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请输入地址',
        theme: 'success',
      });
      return
    }

    if (!this.data.addr.detail) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请输入详细地址',
        theme: 'success',
      });
      return
    }
    //判断是修改还是添加
    let data = wx.getStorageSync('address')
    if(this.data.id!==null) {
      let id = this.data.id
      //2.更新数据
      data[id].userName = this.data.addr.userName
      data[id].address = this.data.addr.address 
      data[id].detail = this.data.addr.detail
      data[id].phone = this.data.addr.phone
      wx.setStorageSync('address', data)
    } else {
      //2.添加新数据
      let obj = {}
      obj.userName = this.data.addr.userName
      obj.address = this.data.addr.address 
      obj.detail = this.data.addr.detail
      obj.phone = this.data.addr.phone
      data.unshift(obj)
      wx.setStorageSync('address', data)
    }
 
    let msg = "添加成功"
    if(that.data.id!=null) msg = "修改成功"
    Dialog.alert({
      title: msg,
      content: '返回查看',
      confirmBtn: '我知道了',
    }).then(() => {
      wx.navigateBack();
    });
  }
})