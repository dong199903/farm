import goodsList from "./../../services/goods/goodsList"
Page({
  data: {
    loading: true,
    goodsList: []
  },
  async onLoad(options) {
    let _id = options._id
    console.log(_id)
    let goods = await goodsList(_id)
    this.setData({
      goodsList: goods.result.data,
      loading: false
    })
  },
})