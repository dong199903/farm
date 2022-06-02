// pages/ke/item/item.js
import article from "./../../../services/write/detail"
import dealTime from "./../../../utils/time"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,statue:false//是否播放
  },

  listen(){
    if(this.data.statue) {
      this.setData({
        statue:false
      })
      this.pause()
    } else {
      this.setData({
        statue:true
      })
      this.show()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const {id} = options
    //根据id获取对应的文章
    const info = await article(id)
    let write = info.result.data[0]
    write.time = dealTime(write._updateTime)
    write.content  = write.content.replace(/\<img/gi, '<img class="rich-imgs" ');
    console.log(write)
    this.setData({
      info:write,
      loading:false
    })
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = false
    innerAudioContext.src = this.data.info.video
    innerAudioContext.onPlay(()=>{
      console.log("播放")
    })
    innerAudioContext.onPause(()=>{
      console.log("暂停")
    })
    this.setData({
      audio:innerAudioContext
    })
  },

  /**播放*/
  show(){
    this.data.audio.play()
  },
  /**暂停 */
  pause(){
    this.data.audio.pause()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
   onHide() {
    console.log("页面隐藏")
  },

  /**
   * 页面退出时，暂停语音
   */
  onUnload() {
    this.data.audio.pause()
  },
})