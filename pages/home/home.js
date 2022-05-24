/*
 * @Author: 董泽平 5296738+tseping_dong@user.noreply.gitee.com
 * @Date: 2022-05-21 11:23:38
 * @LastEditors: 董泽平 5296738+tseping_dong@user.noreply.gitee.com
 * @LastEditTime: 2022-05-24 20:25:19
 * @FilePath: \07-reactc:\Users\19394\Desktop\farm\pages\home\home.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
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
    this.setData({
      swiper: swiper.result.data,
      sort:sort.result.data,
      command:commands.result.data,
      loading:false
    })
  },
  data:{
    loading:true
  },
  goSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  goCategory: function (e) {
    let id = e.currentTarget.dataset.cateid
    wx.navigateTo({
      url: '/pages/category/category?_id=' + id
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