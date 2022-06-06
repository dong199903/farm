// pages/usercenter/manage/manage.js
import getOrderByShop from "./../../../services/order/getOrderByShop"
import updateStatue from "../../../services/order/updateStatue";
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true
  },
  /**发货处理,状态更新 */
  async sendGoods(e){
    this.setData({
      loading:true
    })
    let id = e.currentTarget.dataset.id
    await updateStatue(id,2)
    let list =  this.data.items
    for(let i=0;i<list.length;i++) {
      let tmp = list[i].OrderList
      for(let j=0;j<tmp.length;j++) {
        if(tmp[j]._id===id) {
          //删除这个数据
          tmp.splice(j,1)
          break
        } 
      }
    }
    wx.showToast({
      title: '发货成功',
      icon: '',
      image: '',
      duration: 1500,
      mask: false,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    this.setData({
      items:list,
      loading:false
    })
  },
  /**
   /**
     * statue=1 去发货
     * statue=2 完成
     */
  async onLoad(options) {
    let {id} = options
    id = parseInt(id)
    console.log(id)
    const openid = app.globalData.userInfo.openid
    //订单状态
    let info = await getOrderByShop(openid)
    let list = info.result.list
    let empty = true
    //处理订单信息
    if (id===1) {
      //找到所有待发货的商品
      for(let i=0;i<list.length;i++) {
        let tmp1 = list[i].OrderList
        let tmp2 = []
        for(let j=0;j<tmp1.length;j++) {
          if(tmp1[j].statue===1) tmp2.push(tmp1[j])
        }
        list[i].OrderList = tmp2
        if(list[i].OrderList.length) empty = false
      }
    } else if(id===2) {
      for(let i=0;i<list.length;i++) {
        let tmp1 = list[i].OrderList
        let tmp2 = []
        for(let j=0;j<tmp1.length;j++) {
          if(tmp1[j].statue===3 || tmp1[j].statue===4) tmp2.push(tmp1[j])
        }
        list[i].OrderList = tmp2
        if(list[i].OrderList.length) empty = false
      }
    }
    this.setData({
      items:list,
      loading:false,
      id,
      empty
    })
    console.log(this.data.items)
  }
})