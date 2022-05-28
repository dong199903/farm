// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //获取用户的openid
  const {openid} = event
  const result = await cloud.openapi.subscribeMessage.send({
    touser: openid, // 通过 getWXContext 获取 OPENID
    page: '/pages/home/home',
    data: {
      character_string9: {
        value: parseInt(Math.random()*1000000)
      },
      thing14: {
        value: '商品名称'
      },
      time15: {
        value: '2015年01月05日 12:30'
      },
      amount5: {
        value: '10'
      },
      thing7: {
        value: '其他信息'
      }
    },
    templateId: 'aSsTGj49jKWfW3g5HLqrJkoZbWSu7wZW51tqb25dhq4'
  })
  // result 结构
  // { errCode: 0, errMsg: 'openapi.templateMessage.send:ok' }
  return result
}