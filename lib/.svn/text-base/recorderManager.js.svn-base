const recorderManager = wx.getRecorderManager();

let time = 0;

recorderManager.onStart(() => {
  console.log('recorder start')
})
// recorderManager.onPause(() => {
//   console.log('recorder pause')
// })
recorderManager.onFrameRecorded((res) => {
  const { frameBuffer } = res
  console.log('frameBuffer.byteLength', frameBuffer.byteLength)
})

var options = {
  duration: 600000,
  // sampleRate: 8000,
  // numberOfChannels: 1,
  // encodeBitRate: 192000,
  format: 'mp3',
  // frameSize: 50
}


/*time */


//初始化变量
var hour, minute, second;//时 分 秒
hour = minute = second = 0;//初始化
var millisecond = 0;//毫秒
var recordTime = 0;
var totalSecond = 1800000;
var myTimer;
function initPlayTime() {
  totalSecond = 1800000;
}
//重置函数
function resetTimer(i) {
  var _this=i
  recordTime = 0;
  // window.clearInterval(myTimer);
  millisecond = hour = minute = second = 0;
  _this.setData({
    recordTime: '00:00:00'
  })
  startTimer(_this)
}
//开始函数
function startTimer(i) {
  myTimer = setInterval(()=>{timer(i)}, 50);//每隔50毫秒执行一次timer函数
}
//计时函数
function timer(i) {
  var _this = i
  recordTime = recordTime + 50;
  millisecond = millisecond + 50;
  if (millisecond >= 1000) {
    millisecond = 0;
    second = second + 1;
  }
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
  _this.setData({
    recordTime: hour_ + ':' + minute_ + ':' + second_
  })
 
  if (minute_ == "10") {//限录10分钟
    //停止录音接口

  }
  if (recordTime > totalSecond) {
    
  }
}
//暂停函数
function stopTimer() {
  totalSecond = recordTime + 100;
  clearInterval(myTimer);
}

module.exports ={
  recorderManager,
  options,
  resetTimer,
  stopTimer
} 
