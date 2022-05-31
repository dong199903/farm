import goodsList from "./../../services/goods/goodsList"
Page({
  data: {
    loading: true,
    goodsList: []
  },
  async onLoad(options) {
    let _id = options._id
    console.log(_id)
    let goods = await goodsList(_id)
    this.setData({
      goodsList: goods.result.data,
      loading: false
    })
  },
  /**查看具体的商品 */
  getGoods(e){
    let _id = e.currentTarget.dataset.id
    console.log(_id)
    wx.navigateTo({
      url:"/pages/goods/goods?id="+_id
    })
  },
  skipToSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
})