const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
export const timer = function () {
  let recordTime = "00:00:00"
  let hour, minute, second;//时 分 秒
  hour = minute = second = 0;//初始化
  let totalSecond = 0;
  time += 1;
  if (second >= 60) {
    second = 0;
    minute = minute + 1;
  }

  if (minute >= 60) {
    minute = 0;
    hour = hour + 1;
  }
  var hour_, minute_, second_;
  if (hour < 10) {
    hour_ = "0" + hour;
  } else {
    hour_ = hour;
  }
  if (minute < 10) {
    minute_ = "0" + minute;
  } else {
    minute_ = minute;
  }
  if (second < 10) {
    second_ = "0" + second;
  } else {
    second_ = second;
  }

  recordTime = hour_ + ":" + minute_ + ":" + second_;
  if (totalSecond >= 600) {//限录10分钟
    //停止录音接口
    return
  }

  dd = recordTime;
}
export const resetTime = function () {
  return "00:00:00"
}
module.exports = {
  formatTime: formatTime
}
