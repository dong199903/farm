// pages/ke/ke.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //初始化富文本编辑器
 onEditorReady() {
  const that = this
  const query = wx.createSelectorQuery()//创建节点查询器
  query.in(that).select('#editor').context()//选择id=editor的节点，获取节点内容信息
  query.exec(function(res){
      that.editorCtx = res.context
      console.log(res.context);
    })
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