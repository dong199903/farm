import swipers from "./../../services/swiper/index"
import sorts from "./../../services/sort/index"
Page({
  async onLoad() {
    let swiper = await swipers()
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