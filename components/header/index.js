Component({
  options:{
    addGlobalClass:true
  },
  //父组件给儿子组件传递的数据
  properties: {
    title: {
      type: String,
      value: ''
    },
    statue: {
      type: String,
      value: ''
    }
  },
  methods:{
    back(){
      console.log("返回")
        wx.navigateBack();
    }
  }

})