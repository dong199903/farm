import swipers from "./../../services/swiper/index"
import sorts from "./../../services/sort/index"
import command from "./../../services/command/index"
Page({
  async onLoad() {
    //轮播图数据
    let swiper = await swipers()
    //分类数据，前5个。热门推荐不用加
    let sort = await sorts()
    //热门推荐的商品
    let commands = await command()
    let sortUp = sort.result.data
    console.log(commands)
    this.setData({
      swiper: swiper.result.data,
      sort: sortUp,
      recommend_goods: commands.result.data,
      loading: false
    })
  },
  data: {
    current: 1,
    swiper: [],
    category: [],
    recommend_goods: [],
  },
  data: {
    loading: true
  },
  goSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  goCategory: function (e) {
    let id = e.currentTarget.dataset.cateid
    let title = e.currentTarget.dataset.catetitle
    wx.navigateTo({
      url: '/pages/category/category?id=' + id + '&title=' + title
    })
  },
  categoryTap: function (e) {
    wx.navigateTo({
      url: '../category/category'
    })
  },
  getGoods(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../goods/goods?id=' + id
    })
  }
})