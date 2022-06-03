/*
 * @description: 
 * @author: 董泽平
 */
// pages/submit/submit.js
import sortAll from "./../../services/sort/index"
import sub from "./../../services/goods/subGoods"
const app = getApp()
Page({

  /**判断是登录 */
  onShow(){
    if(!app.globalData.userInfo) {
      wx.reLaunch({
        url: '/pages/usercenter/index',
      })
    }
  },
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
      num:"",
      phone:""
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
  /**获取手机号 */
  getPhone(e){
    let value = e.detail.value
    this.setData({
      phone:parseInt(value)
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

  /**信息校验 */
  check(obj){
    if(!obj.title) 
      return {statue:404,msg:"标题不能是空"}
    if(!obj.desc) 
      return {statue:404,msg:"描述不能是空"}
    if(obj.imgs.length===0)
      return {statue:404,msg:"图片不能是空"}
    if(!obj.video)
      return {statue:404,msg:"视频不能是空"}
    if(!obj.price || isNaN(obj.price))
      return {statue:404,msg:"价格格式错误"}
    if(!obj.num || isNaN(obj.num))
      return {statue:404,msg:"数量格式错误"}
    if(!obj.sid)
      return {statue:404,msg:"分类不能是空"}
    if(!obj.address)
      return {statue:404,msg:"地址不能是空"}
    if(!obj.phone || isNaN(obj.phone) || String(obj.phone).length!==11)
      return {statue:404,msg:"手机格式错误"}
    return {statue:200,msg:"信息成功"}
  },
  /**发布信息 */
  async submit(){
    this.setData({
      loading:true
    })
    let that = this
    let title = this.data.title
    let desc = this.data.desc
    let address = this.data.address
    let imgs = this.data.imgs
    let video = this.data.video
    let price = this.data.price
    let num = this.data.num
    let sid = this.data.sorts[this.data.sIndex]?._id
    let phone = this.data.phone+""
    let checkInfo = this.check({title,desc,address,imgs,video,price,num,sid,phone})
    console.log(checkInfo)
    if(checkInfo.statue===404) {
      wx.showToast({
        title: checkInfo.msg,
        icon: 'fail',
        duration: 1500,
        mask: false,
        success: (result)=>{
          that.setData({
            loading:false
          })
        }
      });
    } else {
      //信息合格
      let goods = {
        title,desc,address,imgs,video,price,sid,num,phone
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
      //4.提示发布信息,并取消加载,清空输入框
      this.setData({
        loading:false,
        window:true,
        title:"",
        address:"",
        price:"",
        num:"",
        imgs:[],
        video:"",
        sValue:"",
        desc:"",
        phone:""
      })
    }
    

  }
})