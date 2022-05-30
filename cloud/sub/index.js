
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //获取用户的openid
  const {openid,title,info,price,time} = event

  let result
  try{
    result = await cloud.openapi.subscribeMessage.send({
      touser: openid, // 通过 getWXContext 获取 OPENID
      page: '/pages/home/home',
      data: {
        character_string9: {
          value: Date.now()
        },
        thing14: {
          value: title
        },
        time15: {
          value: time
        },
        amount5: {
          value: price
        },
        thing7: {
          value: info
        }
      },
      templateId: 'aSsTGj49jKWfW3g5HLqrJkoZbWSu7wZW51tqb25dhq4'
    })
    return result
  }catch(e){
    return e
  }
  
}