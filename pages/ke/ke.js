
/*
 * @description: 
 * @author: 董泽平
 */
// pages/ke/ke.js
import notice from "./../../services/notice/index";
import write1 from "./../../services/write/write1"
import write2 from "./../../services/write/write2"
import write3 from "./../../services/write/write3"
import {srcUrl} from "./../../utils/imgs"
import timeTool from "./../../utils/time"
Page({

  /**
   * 页面的初始数据
   */
   data: {
     
   },
  
  onChange(e) {
    const {
      detail: { current, source },
    } = e;
    console.log(current, source)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    /**
     * notice:通知数据
     * policy:政策文件，无图片
     * story:有1张图片,直接添加属性.img
     * school:有1-3张图片,添加属性.imgs
     */
    let notices = await notice()
    let policy = await write1()
    let story = await write2()
    let school = await write3()
    //policy添加时间属性
    let arr0 = policy.result.data
    for(let i=0;i<arr0.length;i++) {
      arr0[i].time = timeTool(arr0[i]._updateTime)
    }
    //story添加img属性
    let arr1 = story.result.data
    for(let i=0;i<arr1.length;i++) {
      arr1[i].img = srcUrl(arr1[i].content)[0]
      arr1[i].time = timeTool(arr1[i]._updateTime)
    }
    //school添加imgs属性
    let arr2 = school.result.data
    for(let i=0;i<arr2.length;i++) {
      arr2[i].imgs = srcUrl(arr2[i].content)
    }
    this.setData({
      notices:notices.result.data,
      policy:arr0,
      story:arr1,
      school:arr2
    })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

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