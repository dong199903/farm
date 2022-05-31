// pages/order/order_commit/order_commit.js
import updateCommit from "../../../services/order/updateCommit";
import getGoods from "./../../../services/goods/goodsItem"
import subCommit from "./../../../services/order/commit"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:"",
    show:false
  },
  /**获取输入框的值 */
  getValue(e){
    this.setData({
      value:e.detail.value
    })
  },
  /**发布评论 */
  async goCommit(){
    //1.openid,评论信息,商品id,评论时间
    let openid = wx.getStorageSync("users").openid;
    let gid = this.data.gid
    let value = this.data.value
    let _id = this.data.id
    if(!value) {
      wx.showToast({
        title: '内容不能是空',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false
      });
    }else {
      await subCommit({openid,gid,value})
      //2.评论发布成功，对应订单商品的评论改为true id自动保存对应
      await updateCommit(_id)
      //3.提示成功信息
      this.setData({
        show:true
      })
    }
    
    
  },
  /**返回上一个页面 */
  confirmHandle(){
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const {gid,id} = options
    let goodsInfo = await getGoods(gid)
    this.setData({
      goods:goodsInfo.result.data[0],
      gid,
      id
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