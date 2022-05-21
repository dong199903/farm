/*
 * @description: 
 * @author: 董泽平
 */
import swipers from "./../../services/swiper/index"
import sorts from "./../../services/sort/index"
import command from "./../../services/home/command"
Page({
  async onLoad() {
    //获取轮播图数据
    let swiper = await swipers()
    //获取所有分类数据
    let sort = await sorts()
    //获取热门推荐商品
    let commands = await command()

    //截取前5个分类展示，第六个分类是热门推荐
    let sortUp = sort.result.data.slice(0,5)
    console.log("swiper",swiper)
    console.log("sort",sort)
    console.log("command",commands.result.data)
    this.setData({
      items: swiper.result.data,
      sort:sortUp,
      command:commands.result.data
    })
  },
  data: {
    current: 0,
    items: []
  },
  toSort(e){
    wx.reLaunch({
      url: './../goods/list/index?id='+ e.currentTarget.dataset.id +'&title='+e.currentTarget.dataset.name
    })
  },
  onChange(e) {
    const {
      detail: {
        current,
        source
      },
    } = e;
    console.log(current, source)
  },

  sub(){
    wx.navigateTo({
      url: './../goods/search/index',
    });
      
  }
})