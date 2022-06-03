
/*
 * @description: 
 * @author: 董泽平
 */
// pages/ke/ke.js
import notice from "./../../services/notice/index";
import {srcUrl} from "./../../utils/imgs"
import timeTool from "./../../utils/time"
Page({

  /**
   * 页面的初始数据
   */
   data: {
     loading:true
   },
  
  onChange(e) {
    const {
      detail: { current, source },
    } = e;
    console.log(current, source)
  },

  /**跳转搜索课堂界面 */
  goKeSearch(){
    wx.navigateTo({
      url:"/pages/ke/ke_search/index"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let notices = await notice()
    console.log(notices)

    //添加时间和img属性
    let arr = notices.result[1].data
    for(let i=0;i<arr.length;i++) {
      arr[i].time = timeTool(arr[i]._updateTime)
      arr[i].img = srcUrl(arr[i].content)
    }
    this.setData({
      notices:notices.result[0].data,
      aritle:arr,
      loading:false
    })
  },
  write(e){
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: './item/item?id='+id,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
})