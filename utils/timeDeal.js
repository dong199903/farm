export default function timeDeal(time) {
  /**返回年月日,时分秒 */
  let date = new Date(time)
  let year = date.getFullYear()
  let month = date.getMonth()+1
  let day = date.getDate()
  let hour = date.getHours()
  let minutes = date.getMinutes()
  let second = date.getSeconds()
  return {
    year,month,day,hour,minutes,second
  }
}
