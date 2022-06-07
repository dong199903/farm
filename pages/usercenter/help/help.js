
/*
 * @description: 
 * @author: 董泽平
 */
import suggest from "./../../../services/uses/suggest"
const app = getApp()
import Dialog from 'tdesign-miniprogram/dialog/index';
// pages/usercenter/help/help.js
Page({

  /**
   * 页面的初始数据
   */

  /**
   * 上次图片逻辑处理
   * 1.设置数组，大小是3.默认保存3个空元素。
   * 2.遍历数组，如果是图像，显示。
   * 3.如果是空的，显示上次图片的按钮
   * 4.over
   * 
   */
  data: {
    originFiles: [],
    gridConfig: {},
    uploadImgs:[null,null,null],
    loading:false
  },
  getInfo(e) {
    this.setData({
      info: e.detail.value
    })
  },
  getName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  getTel: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  
  /**
   * 
   * 选择图片
   */
  upload(){
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        console.log(result)
        let imgs = that.data.uploadImgs
        //找到数组第一个非空的位置，插入
        let index = imgs.indexOf(null)
        imgs[index] = result.tempFilePaths[0]
        console.log(imgs)
        that.setData({
          uploadImgs:imgs
        })
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  /**上传图片 */
  uploadImg: function () {
    let imgs = []
    let that = this
    console.log(that.data.uploadImgs)
    //将所有非空的图片上传
    let success = []
    that.data.uploadImgs.forEach(element => {
      if(element) success.push(element)
    });console.log(success)
    return new Promise((resolve, reject) => {
      for (let i = 0; i < success.length; i++)
        wx.cloud.uploadFile({
          cloudPath: 'farm/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + ".jpg", //使用时间戳加随机数作为上传至云端的图片名称
          filePath: success[i], // 本地文件路径
          success: res => {
            imgs.push(res.fileID)
            if (imgs.length === success.length) resolve(imgs)
          },
          fail: function (err) {
            reject(err)
          }
        })
    })
  },
  /**提交意见--保存到云数据库 */
  submit: async function () {
    let res = await this.uploadImg()
    let info = {}
    info.name = this.data.name
    info.phone = this.data.phone
    info.info = this.data.info
    info.imgs = res
    this.setData({
      loading:true
    })
    let msg = await suggest(app.globalData.openid, info)
    if (msg.code === 103)
      Dialog.alert({
        title: 'message',
        content: '留言成功',
        confirmBtn: '确定',
      }).then(() => {
        wx.navigateBack()
      });
    this.setData({
      loading:false
    })
  }
})