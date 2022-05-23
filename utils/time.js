/*
 * @description: 
 * @author: 董泽平
 */
export default function (date, fmt = 'yyyy-MM-dd') {
  date = new Date(date)
  let map = {
      'y': date.getFullYear(),
      'M': date.getMonth() + 1,
      'd': date.getDate()
  };
  return fmt.replace(/([yMd])+/g, function (match, key) {
      let val = map[key].toString();
      if (val.length === 1) val = '0' + val;
      if (key === 'y') {
          val = val.substr(4 - match.length);
      } else {
          val = val.substr(2 - match.length);
      }
      return val;
  })
}

