// pages/order/order.js
import OrderList from "./../../services/order/getOrderList"
import updateStatue from "./../../services/order/updateStatue"
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
  /**确认收获，状态改为3 */
  async goReceive(e){
    this.setData({
      loading:true
    })
    let id = e.currentTarget.dataset.id
    await updateStatue(id,3)
    this.onShow()
    wx.showToast({
      title: '收货成功',
      icon: 'none',
      image: '',
      duration: 1500,
      mask: false
    });
    this.setData({
      loading:false
    })
    //直接修改数据,_id订单的状态修改成为3
    

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
    /**
     * 1.全部订单
     * 2.待付款 x
     * 3.待发货
     * 4.待收货
     * 5.待评价
     * 6.退款/售后 x
     */
    let val = parseInt(e.detail.value) 
    //1,2,6特殊处理（暂时做不了，需要物流参与）
    if(val===2 || val===6) {
      this.setData({
        showItem:[]
      })
    } 
    else if(val===1) {
      this.setData({
        showItem:this.data.orderList
      })
    }
    else {
      let nowStatue = val-2
      console.log("nowStatue",nowStatue)
      //1.拷贝一份数据，避免污染原始数据
      let newData = JSON.parse(JSON.stringify(this.data.orderList))
      for(let i=0;i<newData.length;i++) {
        let info1 = newData[i].OrderList
        let info2 = []
        info1.forEach(item=>{
          if(item.statue===nowStatue) info2.push(item)
        })
        newData[i].OrderList = info2
      }
      console.log(newData)
      this.setData({
        showItem:newData
      })
    }
    console.log(this.data.showItem)
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
    //1.获取当前用户的所有订单
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
      showItem:orderList,
      loading:false
    })
  }
})