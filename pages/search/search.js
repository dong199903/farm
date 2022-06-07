// pages/search/search.js
import search from '../../services/search/index'
import getSort from "../../services/sort/index"
Page({
  /**
   * 1.用户按下输入框，筛选条件置为全部
   * 2.输入框有内容，筛选条件筛选时才有用
   */
  data: {
    loading:true,
    selectBox:false,
    value:"",
    empty:false,
    index1: 0,
    index2: 0,
    array2: ['全部', '0~100', '100~300', '300~500', '500~']
  },
  /**获取分类内容 */
  async onLoad(){
    let info = await getSort()
    //数组第一项添加全部
    let arr = info.result.data
    arr.unshift({name:"全部"})
    this.setData({
      sorts:arr,
      loading:false
    })
  },  
  /**输入框聚焦时触发 筛选框隐藏 */
  focus(){
    this.setData({
      selectBox:false,
      value:"",
      index1:0,
      index2:0
    })
  },
  /**获取输入框的内容 */
  input(e){
    this.setData({
      value:e.detail.value
    })
  },
  /**获取搜索的结果 */
  async searchRes(){
    if(!this.data.value) {
      wx.showToast({
        title: "请输入内容",
        icon: 'error', //图标，支持"success"、"loading" 
        mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false 
      })
      return 
    }
    this.setData({
      loading:true
    })
    const info = await search(this.data.value)
    this.setData({
      showList:info.result.res.data,
      goodsList:info.result.res.data,
      selectBox:true,
      loading:false,
      value:""
    })
    if(!this.data.showList.length) this.setData({empty:true})
  },


  /**跳转商品详情 */
  getGoods(e){
    let _id = e.currentTarget.dataset.id
    console.log(_id)
    wx.navigateTo({
      url:"/pages/goods/goods?id="+_id
    })
  },
  /**商品分类条件选择 */
  bindPickerChange1: function (e) {
    this.setData({
      index1: e.detail.value
    })
    this.changeGoodsShow()
  },
  /*商品价格条件选择 */
  bindPickerChange2: function (e) {
    this.setData({
      index2: e.detail.value
    })
    this.changeGoodsShow()
  },
  /**筛选符合条件的商品 */
  changeGoodsShow: function () {
    let temp = []
    if (this.data.index1 == 0 && this.data.index2 == 0) {
      temp = this.data.goodsList
    } else if (this.data.index1 == 0) {
      temp = this.data.goodsList.filter(i => {
        if (this.data.index2 == 1 && (i.price < 100 && i.price >= 0)) {
          return true
        } else if (this.data.index2 == 2 && (i.price < 300 && i.price >= 100)) {
          return true
        } else if (this.data.index2 == 3 && (i.price < 300 && i.price >= 500)) {
          return true
        } else if (this.data.index2 == 4 && (i.price > 500)) {
          return true
        }
      })
    } else if (this.data.index2 == 0) {
      temp = this.data.goodsList.filter(i => {
        if (i.sid == this.data.sorts[this.data.index1 - 1]._id) {
          return true
        }
      })
    } else {
      temp = this.data.goodsList.filter(i => {
        if (i.sid == this.data.index1) {
          if (this.data.index2 == 1 && (i.price < 100 && i.price >= 0)) {
            return true
          } else if (this.data.index2 == 2 && (i.price < 200 && i.price >= 100)) {
            return true
          } else if (this.data.index2 == 3 && (i.price < 300 && i.price >= 200)) {
            return true
          } else if (this.data.index2 == 4 && (i.price < 400 && i.price >= 300)) {
            return true
          } else if (this.data.index2 == 5 && (i.price > 500)) {
            return true
          }
        }
      })
    }
    this.setData({
      showList: temp
    })
  },
  
})