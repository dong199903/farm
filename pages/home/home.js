/*
 * @description: 
 * @author: 董泽平
 */
/*
 * @description: 
 * @author: 董泽平
 */
/*
 * @description: 
 * @author: 董泽平
 */
import swipers from "./../../services/swiper/index"
import sorts from "./../../services/sort/index"
import command from "./../../services/command/index"
Page({
  async onLoad() {
    //轮播图数据
    let swiper = await swipers()
    //分类数据
    let sort = await sorts()
    //热门推荐的商品
    let commands = await command()
<<<<<<< HEAD
=======
<<<<<<< Updated upstream
    let sortUp = sort.result.data.slice(0,5)
>>>>>>> 2d2a8ad7e602d9d9c9152c96a7f22b2cdf9c8d54
    console.log(swiper,sort,commands)
    this.setData({
      swiper: swiper.result.data,
      sort:sort.result.data,
      command:commands.result.data,
      loading:false
    })
  },
  data: {
    loading:true
=======
    let sortUp = sort.result.data.slice(0, 5)
    this.setData({
      swiper: swiper.result.data,
      sort: sortUp,
      command: commands.result.data,
      loading: false
    })
  },
  data: {
    loading: true
>>>>>>> Stashed changes
  },
  goSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  goCategory: function (e) {
<<<<<<< HEAD

    wx.navigateTo({
      url: '/pages/category/category?_id='+e.currentTarget.dataset.id,
=======
    let id = e.currentTarget.dataset.cateid
    let title = e.currentTarget.dataset.catetitle
    console.log(title);
    wx.navigateTo({
      url: '/pages/category/category?id=' + id + '&title=' + title
>>>>>>> 2d2a8ad7e602d9d9c9152c96a7f22b2cdf9c8d54
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