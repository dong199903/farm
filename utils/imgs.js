/*
 * @description: 
 * @author: 董泽平
 */
/**
 * 匹配获取所有图片链接
 * @param{*} str
 */
 export function srcUrl(str) {
  const pa = []
  // var str = "this is test string <img src=\"http:yourweb.com/test.jpg\" width='50' > 123 and the end <img src=\"所有地址也能匹配.jpg\" /> 33! <img src=\"/uploads/attached/image/20120426/20120426225658_92565.png\" alt=\"\" />"
  // 匹配图片（g表示匹配所有结果i表示区分大小写）
  var imgReg = /<img.*?(?:>|\/>)/gi
  // 匹配src属性
  var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
  var arr = str.match(imgReg)
  // alert('所有已成功匹配图片的数组：' + arr)
  if (arr) {
    for (var i = 0; i < arr.length; i++) {
      var src = arr[i].match(srcReg)
      // 获取图片地址
      if (src[1]) {
        // alert('已匹配的图片地址' + (i + 1) + '：' + src[1])
        pa.push(src[1].slice(0, src[1].length - 1))
      }
    }
  }

  return pa
}

