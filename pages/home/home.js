import swipers from "./../../services/swiper/index"
import sorts from "./../../services/sort/index"
import command from "./../../services/command/index"

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
    //轮播图数据
    let swiper = await swipers()
    //分类数据
    let sort = await sorts()
    //热门推荐的商品
    let commands = await command()
    this.setData({
      swipersList: swiper.result.data,
      sortsList: sort.result.data,
      commandGoodsList: commands.result.data,
      loading: false
    })
  }
})