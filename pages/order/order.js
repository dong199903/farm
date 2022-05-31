// pages/order/order.js
import OrderList from "./../../services/order/getOrderList"
Page({
  data: {
    loading:true,
    value:"1",
    tarbars:[
      {value:"1",content:"全部"},
      {value:"2",content:"待付款"},
      {value:"3",content:"待发货"},
      {value:"4",content:"待收货"},
      {value:"5",content:"待评价"},
      {value:"6",content:"退款/售后"}
    ]
  },
  /**跳转评价 */
  goCommit(e){
    //图片，标题，描述
    let index1 = e.currentTarget.dataset.index1
    let index2 = e.currentTarget.dataset.index2
    console.log(index1,index2)
    //获取对应商品信息
    console.log(this.data.orderList)
    let gid = this.data.orderList[index1].OrderList[index2].gid
    let id = this.data.orderList[index1].OrderList[index2]._id
    wx.navigateTo({
      url: '/pages/order/order_commit/order_commit?gid='+gid+"&id="+id
    });
  },
  onTabsChange(e) {
    console.log(e.detail.value)
  },
  /**返回对应商品 */
  findGoods(goods,gid){
    for(let i=0;i<goods.length;i++) {
      if(goods[i]._id===gid) return goods[i]
    }
  },
  /**
   * 获取所有的订单
   */
  async onShow(options) {
    //1.获取用户的openid
    let orders = await OrderList(wx.getStorageSync("users").openid)
    console.log(orders)
    let goods = orders.result.goods.data//商品信息
    let orderList = orders.result.orders.list//所有的订单详情
    console.log(goods,orderList)
    orderList.forEach(item=>{
      //具体的商品的所有订单
      let orderItems = item.OrderList
      orderItems.forEach(itm=>{
        //单个商品的订单
        let gid = itm.gid
        itm.goods = this.findGoods(goods,gid)
      })
    })
    //最终的订单数据

    this.setData({
      orderList,
      loading:false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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