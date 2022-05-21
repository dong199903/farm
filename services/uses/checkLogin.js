export default function (openid) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: "checkLogin",
      data: {
        openid
      }
    }).then(msg => {
      if (msg.result.res.data.length) {
        resolve({
          code: 200,
          msg: msg.result.res.data[0]
        })
      } else {
        resolve({
          code: 100,
          msg: "未注册"
        })
      }
    }).catch(err => {
      reject({
        code: 404,
        msg: err
      })
    })
  })
}