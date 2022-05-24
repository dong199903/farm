/*
 * @description: 
 * @author: 董泽平
 */
// pages/submit/submit.js
import sortAll from "./../../services/sort/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible:false,
    imgs:[],
    video:""
  },
  onCancel(){
    this.setData({
      visible:false,
    })
  },
  choiceSort(){
    this.setData({
      visible:true,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    //获取所有的分类数据
    let sortsData = await sortAll()
    console.log(sortsData)
    this.setData({
      sorts:sortsData.result.data,
      sValue:"",
      address:"",
      video:""
    })
  },
  /**上传临时图片 */
  imgSuccess(e){
    let upload = e.detail.files
    console.log(upload)
    let imgs = this.data.imgs
    if(upload.length)
    imgs.push(...upload)
    this.setData({
      imgs
    })
    console.log(this.data.imgs)
  },
  /**上传临时视频 */
  videoSucces(e){
    console.log(e.detail.files)
    this.setData({
      video:e.detail.files[0].url
    })
  },
  /**取消临时上传视频 */
  cancelVideo(e){
    console.log("取消上传")
    this.setData({
      video:""
    })
  },
  /**获取地址 */
  getAddress(){

  },
  /**通过地图选择位置 */
  map: function () {
    let that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 
   * 选择分类数据
   */
  choiceRes(e){
    //获取当权分类的数组索引,并保存起来
    let idx = e.currentTarget.dataset.id
    let val = this.data.sorts[idx].name
    this.setData({
      sIndex:e.currentTarget.dataset.id,
      sValue:val,
      visible:false
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