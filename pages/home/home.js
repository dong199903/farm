import swipers from "./../../services/swiper/index"
import sorts from "./../../services/sort/index"
import command from "./../../services/command/index"
var QQMapWX = require('./../../utils/qqmap-wx-jssdk');
var qqmapsdk;
const app = getApp()
Page({
  data: {
    loading: true,
    swipersList: [],
    sortsList: [],
    commandGoodsList: []
  },
  skipToSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  skipToCategory: function (e) {
    let id = e.currentTarget.dataset.cateid
    wx.navigateTo({
      url: '/pages/category/category?_id=' + id
    })
  },
  getGoods(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../goods/goods?id=' + id
    })
  },
  async onLoad() {
    let that = this
    qqmapsdk = new QQMapWX({
      key: 'SKTBZ-P5FC3-EVU3O-YW4XS-3WVQQ-VZBTZ'
    });
    qqmapsdk.reverseGeocoder({
      keyword: 'dzp',
      success: function (res) {
          app.globalData.location = res.result.address_component.city
          that.setData({
            location:res.result.address_component.city
          })
      },
      fail: function (res) {
          console.log(res);
      },
      complete: function (res) {
          console.log(res);
      }
    });
    //轮播图数据
    let swiper = await swipers()
    //分类数据
    let sort = await sorts()
    this.setData({
      swipersList: swiper.result.data,
      sortsList: sort.result.data,
      loading: false
    })
  },
  async onShow(){
    
    //热门推荐的商品
    this.setData({
      loading:true
    })
    let commands = await command()
    this.setData({
      commandGoodsList: commands.result.data,
      loading: false
    })
  }
})