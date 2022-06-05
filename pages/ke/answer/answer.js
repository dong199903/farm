// pages/ke/answer/answer.js
import subAnswer from "./../../../services/answer/subQuestion"
import answerAll from "./../../../services/answer/getAnswerAll"
import updateAnswer from "./../../../services/answer/updateAnswer"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subBox:false,answerBox:false,
    value1:"",value2:"",
    loading:true
  },
  /**回答问题发布 */
  async updateAnswers(){
    let val = this.data.value2
    console.log(val)
    if(!val) wx.showToast({
      title: '内容不能是空',
      icon: 'none',
      image: '',
      duration: 1500,
      mask: false
    });
    else {
      let openid = wx.getStorageSync("users").openid;
      let _id = this.data.choice_id
      let info = await updateAnswer({openid,_id,val})
      wx.showToast({
        title: '回答成功',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false
      })
      //将对应的数据进行更新
      let answers = this.data.answers
      for(let i=0;i<answers.length;i++) {
        if(answers[i]._id===_id) {
          answers[i].response_id = openid
          answers[i].answer = val
          break
        }
      }
      this.setData({
        answers
      })
    }
    this.setData({
      val2:"",answerBox:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    //获取所有的问题
    let openid = wx.getStorageSync("users").openid
    let answers = await answerAll(openid)
    this.setData({
       answers:answers.result[0].data,
       expert:answers.result[1].data[0].userInfo.expert,
       loading:false
    })

  },
  /**获取输入框内容 */
  input(e){
    this.setData({
      value1:e.detail.value
    })
  },
  input2(e){
    this.setData({
      value2:e.detail.value
    })
  },
  /**关闭发布问题的弹窗 */
  closeSub(){
    console.log("close")
    this.setData({
      subBox:false
    })
  },
  /**发布问题显示 */
  subShow(){
    this.setData({
      subBox:true
    })
  },
  /**关闭回答问题 */
  closeAnswer(){
    this.setData({
      answerBox:false
    })
  },
  /**回答问题显示 */
  answerShow(e){
    this.setData({
      choice_id:e.currentTarget.dataset.id
    })
    this.setData({
      answerBox:true
    })
  },
  /**发布问题 */
  async subQues(){
    let val = this.data.value1
    console.log(val)
    if(!val) wx.showToast({
      title: '内容不能是空',
      icon: 'none',
      image: '',
      duration: 1500,
      mask: false
    });
    else {
      let openid = wx.getStorageSync("users").openid;
      let info = await subAnswer(val,openid)
      let _id = info.result._id
      wx.showToast({
        title: '发布成功',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false
      })
      //将最新的发布内容插入头部
      let answers = this.data.answers
      answers.unshift({_id:_id,request_id:openid,request:val,answer:""})
      this.setData({
        answers
      })
    }
    this.setData({
      subBox:false,
      value1:""
    })
  }
})