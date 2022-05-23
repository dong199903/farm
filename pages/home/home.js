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
    //分类数据，前5个。热门推荐不用加
    let sort = await sorts()
    //热门推荐的商品
    let commands = await command()
    let sortUp = sort.result.data.slice(0,5)
    console.log(swiper,sort,commands)
    this.setData({
      swiper: swiper.result.data,
      sort:sortUp,
      command:commands.result.data,
      loading:false
    })
  },
  data: {
    loading:true
  },
  goSearch: function () {
    wx.navigateTo({
        url: '/pages/search/search',
    })
  },
  goCategory: function (e) {
    wx.navigateTo({
      url: '/pages/category/category',
  })
  },
  categoryTap: function(e){
    wx.navigateTo({url: '../category/category'})
  },
  getGoods(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({url: '../goods/goods?id='+id})
  }
})