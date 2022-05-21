/**用户的建立 */
export default function (openid, info) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: "suggest",
      data: {
        openid: openid,
        info: info
      }
    }).then(msg => {
      console.log(msg)
      resolve({
        code: 103
      })
    }).catch(err => {
      reject({
        code: 404
      })
    })
  })
}