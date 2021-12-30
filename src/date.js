if(!String.prototype.repeat) {
  String.prototype.repeat = function(count, seperator) {
      var seperator = seperator || '';
      var a = new Array(count);
      for (var i = 0; i < count; i++){
          a[i] = this;
      }
      return a.join(seperator);
  }
}


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 星期 1个占位符
// 例子
// (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
// (new Date()).Format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function (fmt) {
var week = {
  0: '星期日',
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六'
}
var o = {
  'y+': this.getFullYear(), // 年份
  'M+': this.getMonth() + 1, // 月份
  'd+': this.getDate(), // 日
  'h+': this.getHours(), // 小时
  'm+': this.getMinutes(), // 分
  's+': this.getSeconds(), // 秒
  'w+': week[this.getDay()], // 星期
  'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
  'S': this.getMilliseconds() // 毫秒
}
for (var k in o) {
  fmt = fmt.replace(new RegExp('(' + k + ')'), function(m) {
      // 直接返回 o[k] 结果是 'y-M-d' '2020-12-23'，没法控制位数
      // 下面的做法是截取匹配位数
      return ("0".repeat(m.length) + o[k]).substr(("" + o[k]).length)
  })
}
return fmt
}
