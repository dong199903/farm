/*
 * @description: 
 * @author: 董泽平
 */
// pages/submit/submit.js
import sortAll from "./../../services/sort/index"
import sub from "./../../services/goods/subGoods"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible:false,
    imgs:[],
    video:"",
    loading:false,
    window:false
  },
  onCancel(){
    this.setData({
      visible:false,
    })
  },
  choiceSort(){
    this.setData({
      visible:true,
    })
  },
  confirmHandle(){
    this.setData({
      window:false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    //获取所有的分类数据
    let sortsData = await sortAll()
    this.setData({
      sorts:sortsData.result.data,
      sValue:"",
      address:"",
      video:"",
      title:"",
      desc:"",
      price:"",
      num:""
    })
  },
  /**上传临时图片 */
  imgSuccess(e){
    let upload = e.detail.files
    console.log(upload)
    let imgs = this.data.imgs
    if(upload.length)
    imgs.push(...upload)
    this.setData({
      imgs
    })
    console.log(this.data.imgs)
  },
  /**上传临时视频 */
  videoSucces(e){
    console.log(e.detail.files)
    this.setData({
      video:e.detail.files[0].url
    })
  },
  /**取消临时上传视频 */
  cancelVideo(e){
    console.log("取消上传")
    this.setData({
      video:""
    })
  },
  /**取消临时上传图片 */
  cacelImg(e){
    let index = e.currentTarget.dataset.index
    console.log(index)
    //对应下标的图片删除
    let imgs = this.data.imgs
    imgs.splice(index,1)
    this.setData({
      imgs:imgs
    })
  },
  /**获取地址 */
  getAddress(e){
    let value = e.detail.value
    this.setData({
      address:value
    })
  },
  /**获取标题 */
  getTitle(e){
    let value = e.detail.value
    this.setData({
      title:value
    })
  },
  /**获取描述 */
  getDesc(e){
    let value = e.detail.value
    this.setData({
      desc:value
    })
  },
  /**获取价格 */
  getPrice(e){
    let value = e.detail.value
    this.setData({
      price:parseInt(value) 
    })
  },
  /**获取库存量 */
  getNum(e){
    let value = e.detail.value
    this.setData({
      num:parseInt(value) 
    })
  },
  /**通过地图选择位置 */
  map: function () {
    let that = this
    wx.chooseLocation({
      success: function (res) {
        let addr = res.address
        that.setData({
          address:addr
        })
      }
    })
  },
  /**
   * 
   * 选择分类数据
   */
  choiceRes(e){
    //获取当权分类的数组索引,并保存起来
    let idx = e.currentTarget.dataset.id
    let val = this.data.sorts[idx].name
    this.setData({
      sIndex:idx,
      sValue:val,
      visible:false
    })
  },
  /**本地图片上传到服务器 */
  uploadImgToDatabase(success){
    let imgs = []
    return new Promise((resolve, reject) => {
      for (let i = 0; i < success.length; i++)
        wx.cloud.uploadFile({
          cloudPath: 'farm/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + ".jpg", //使用时间戳加随机数作为上传至云端的图片名称
          filePath: success[i].url, // 本地文件路径
          success: res => {
            imgs.push(res.fileID)
            if (imgs.length === success.length) resolve(imgs)
          },
          fail: function (err) {
            reject(err)
          }
        })
    })
  },
  /**本地视频上传到服务器 */
  uploadVideoToDatabase(video){
    return new Promise((resolve,reject)=>{
      wx.cloud.uploadFile({
        cloudPath: 'farm/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + ".mp4", //使用时间戳加随机数作为上传至云端的图片名称
        filePath:video, // 本地文件路径
        success: res => {
          resolve(res.fileID)
        },
        fail: function (err) {
          reject(err)
        }
      })
    })
  },
  /**发布信息 */
  async submit(){
    this.setData({
      loading:true
    })
    let title = this.data.title
    let desc = this.data.desc
    let address = this.data.address
    let imgs = this.data.imgs
    let video = this.data.video
    let price = this.data.price
    let num = this.data.num
    let sid = this.data.sorts[this.data.sIndex]._id
    console.log(title,desc,address,imgs,video,price,sid)
    let goods = {
      title,desc,address,imgs,video,price,sid,num
    }
    //1.上传图片和视频
    imgs = await this.uploadImgToDatabase(imgs)
    video = await this.uploadVideoToDatabase(video)
    console.log(imgs,video)
    goods.imgs = imgs
    goods.video = video
    //2.统一上传到后端
    let info = await sub(goods)
    console.log(info)
    //3.取消加载
    this.setData({
      loading:false
    })
    //4.提示发布信息
    this.setData({
      window:true,
      title:"",
      address:"",
      price:"",
      num:"",
      imgs:[],
      video:"",
      sValue:"",
      desc:""
    })

  }
})