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
    background: [
      {
        image: `../../style/images/轮播图.png`,
      },{
        image: `../../style/images/轮播图.png`,
      },{
        image: `../../style/images/轮播图.png`,
      },{
        image: `../../style/images/轮播图.png`,
      },{
        image: `../../style/images/轮播图.png`,
      },
    ],
    category: [
      {
        id: '',
        text: '农禽产品',
        image: `../../style/images/蔬菜水果.png`,
      }, {
        id: '',
        text: '农禽产品',
        image: `../../style/images/蔬菜水果.png`,
      }, {
        id: '',
        text: '农禽产品',
        image: `../../style/images/蔬菜水果.png`,
      }, {
        id: '',
        text: '农禽产品',
        image: `../../style/images/蔬菜水果.png`,
      }
    ],
    goods: [
      {
        "_id":"dksekr1fajfada",
        "sid":"1",
        "price1":9999,
        "price2":88888,
        "img":`../../style/images/蔬菜水果.png`,
        "desc":"物美价廉物美价廉物美价廉物美价廉物美价廉物美价廉物美价廉物美价廉物美价廉",
        "title":"水果水果水果水果水果水果水果水果水果水果水果水果水果水果"
      }, {
        "_id":"dksekr1fajfada",
        "sid":"1",
        "price1":99,
        "price2":88,
        "img":`../../style/images/蔬菜水果.png`,
        "desc":"物美价廉",
        "title":"水果"
      }, {
        "_id":"dksekr1fajfada",
        "sid":"1",
        "price1":99,
        "price2":88,
        "img":`../../style/images/蔬菜水果.png`,
        "desc":"物美价廉",
        "title":"水果"
      }, {
        "_id":"dksekr1fajfada",
        "sid":"1",
        "price1":99,
        "price2":88,
        "img":`../../style/images/蔬菜水果.png`,
        "desc":"物美价廉",
        "title":"水果"
      }, {
        "_id":"dksekr1fajfada",
        "sid":"1",
        "price1":99,
        "price2":88,
        "img":`../../style/images/蔬菜水果.png`,
        "desc":"物美价廉",
        "title":"水果"
      }, {
        "_id":"dksekr1fajfada",
        "sid":"1",
        "price1":99,
        "price2":88,
        "img":`../../style/images/蔬菜水果.png`,
        "desc":"物美价廉",
        "title":"水果"
      }, {
        "_id":"dksekr1fajfada",
        "sid":"1",
        "price1":99,
        "price2":88,
        "img":`../../style/images/蔬菜水果.png`,
        "desc":"物美价廉",
        "title":"水果"
      }, {
        "_id":"dksekr1fajfada",
        "sid":"1",
        "price1":99,
        "price2":88,
        "img":`../../style/images/蔬菜水果.png`,
        "desc":"物美价廉",
        "title":"水果"
      }, {
        "_id":"dksekr1fajfada",
        "sid":"1",
        "price1":99,
        "price2":88,
        "img":`../../style/images/蔬菜水果.png`,
        "desc":"物美价廉",
        "title":"水果"
      }, {
        "_id":"dksekr1fajfada",
        "sid":"1",
        "price1":99,
        "price2":88,
        "img":`../../style/images/蔬菜水果.png`,
        "desc":"物美价廉",
        "title":"水果"
      }, {
        "_id":"dksekr1fajfada",
        "sid":"1",
        "price1":99,
        "price2":88,
        "img":`../../style/images/蔬菜水果.png`,
        "desc":"物美价廉",
        "title":"水果"
      }, {
        "_id":"dksekr1fajfada",
        "sid":"1",
        "price1":99,
        "price2":88,
        "img":`../../style/images/蔬菜水果.png`,
        "desc":"物美价廉",
        "title":"水果"
      }, {
        "_id":"dksekr1fajfada",
        "sid":"1",
        "price1":99,
        "price2":88,
        "img":`../../style/images/蔬菜水果.png`,
        "desc":"物美价廉",
        "title":"水果"
      }, {
        "_id":"dksekr1fajfada",
        "sid":"1",
        "price1":99,
        "price2":88,
        "img":`../../style/images/蔬菜水果.png`,
        "desc":"物美价廉",
        "title":"水果"
      }, {
        "_id":"dksekr1fajfada",
        "sid":"1",
        "price1":99,
        "price2":88,
        "img":`../../style/images/蔬菜水果.png`,
        "desc":"物美价廉",
        "title":"水果"
      }, {
        "_id":"dksekr1fajfada",
        "sid":"1",
        "price1":99,
        "price2":88,
        "img":`../../style/images/蔬菜水果.png`,
        "desc":"物美价廉",
        "title":"水果"
      }, {
        "_id":"dksekr1fajfada",
        "sid":"1",
        "price1":99,
        "price2":88,
        "img":`../../style/images/蔬菜水果.png`,
        "desc":"物美价廉",
        "title":"水果"
      }
    ]
  },
})