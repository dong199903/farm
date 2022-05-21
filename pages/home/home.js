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
      items: swiper.result.data,
      sort:sortUp
    })
  },
  data: {
    current: 1,
    banner: [
      {
        gid: '1',
        imgUrl: `../../style/images/轮播图.png`,
      },{
        gid: '2',
        imgUrl: `../../style/images/轮播图.png`,
      }, {
        gid: '3',
        imgUrl: `../../style/images/轮播图.png`,
      }
    ],
    channel: [
      {
        name: '农禽产品',
        c_id: '1',
        img: `../../style/images/蔬菜水果.png`
      },
      {
        name: '农禽产品',
        c_id: '1',
        img: `../../style/images/蔬菜水果.png`
      },
      {
        name: '1',
        c_id: '1',
        img: `../../style/images/蔬菜水果.png`
      },{
        name: '1',
        c_id: '1',
        img: `../../style/images/蔬菜水果.png`
      },{
        name: '1',
        c_id: '1',
        img: `../../style/images/蔬菜水果.png`
      }
    ],
    goods: [
      {
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      },{
        g_id: '1',
        name: '蔬菜水果',
        imgUrl: `../../style/images/蔬菜水果.png`,
        price: '99'
      }
    ]
  },
  
  categoryTap: function(e){
    wx.navigateTo({url: '../category/category'})
  }
})