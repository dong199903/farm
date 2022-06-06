
/*
 * @description: 
 * @author: 董泽平
 */
// pages/ke/ke.js
import notice from "./../../services/notice/index";
import {srcUrl} from "./../../utils/imgs"
import timeTool from "./../../utils/time"
import getAnswerOne from "./../../services/answer/getAnswerOne"
Page({
   data: {
     loading:true
   },
  
  onChange(e) {
    const {
      detail: { current, source },
    } = e;
    console.log(current, source)
  },
  /**跳转问答专区 */
  goAnswer(){
    wx.navigateTo({
      url:"/pages/ke/answer/answer"
    })
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
  /**显示问题和回答 */
  async onShow(){
    let info = await getAnswerOne()
    this.setData({
      answer:info.result.data[0]
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