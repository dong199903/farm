// pages/ke/ke_search/index.js
import searchList from "./../../../services/search/ke"
import {srcUrl} from "./../../../utils/imgs"
import timeTool from "./../../../utils/time"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:"",
    empty:false
  },
  /**获取搜索 */
  async goSearch(){
    this.setData({
      result:[]
    })
    if(this.data.value) {
      let info = await searchList(this.data.value)
      let res= info.result.data
      if(res.length) {
        //处理日期和图片
        for(let i=0;i<res.length;i++) {
          res[i].time = timeTool(res[i]._updateTime)
          res[i].img = srcUrl(res[i].content)
        }
        this.setData({
          result:res,
        })
      } else {
        this.setData({
          empty:true
        })
      }
      this.setData({
        value:""
      })
    }
    
  },
  /**获取搜索内容 */
  getValue(e){
    this.setData({
      value:e.detail.value
    })
  },
  write(e){
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: './../item/item?id='+id,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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