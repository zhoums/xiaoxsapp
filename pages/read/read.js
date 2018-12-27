const app = getApp();
import recorder from '../../lib/recorderManager.js';
const innerAudioContext = wx.createInnerAudioContext();

Page({
  data: {
    isRecording: false,
    tempFilePath: '',
    recordTime: '00:00:00',
  },

  onShow: function(options) {
    this.login();
    recorder.recorderManager.onStop((res) => {
      console.log('res',res)
      this.setData({
        isRecording: false,
        tempFilePath: res.tempFilePath
      })
      app.globalData.recordUrl = res.tempFilePath;

    })
  },
  login() {
    var accountInfo = wx.getAccountInfoSync();
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: `https://xshishu.com/wxapp/user/getUserInfo?code=${res.code}`,
            success(response) {
              // console.log("wx.login--->>" + JSON.stringify(response));
              if (response.data.status == -1 || response.data.result == null) {
                wx.navigateTo({
                  url: '../login/index'
                })
                return;
              }
              app.globalData.form['unionId'] = response.data.result.unionId;
              app.globalData.form['author'] = response.data.result.userName;
              app.globalData.form['description'] = response.data.result.description;
              app.globalData.form['age'] = response.data.result.age;

            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  upload() {
    if (!this.data.isRecording && this.data.tempFilePath) {
      // wx.navigateTo({
      //   url: '../upload/upload?unionId=' + app.globalData.form['unionId'],
      // })
      wx.showLoading({
        title: '上传中。。。',
      })
      wx.uploadFile({
        url: 'https://xshishu.com/wxapp/book/addBook',
        filePath: app.globalData.recordUrl,
        name: 'voiceurl',
        header: {
          'content-type': 'multipart/form-data'
        },
        success: function (res) {
          let data = JSON.parse(res.data);
          console.log('dsll',data)
          app.globalData.bookid = data.result;
          wx.hideLoading({
            success: () => {
              if (data.status == 0) {
                wx.showToast({
                  title: '上传成功！',
                  success: () => {
                    self.resetGlobalData();
                    setTimeout(() => {
                      wx.navigateTo({
                        url: '../publish/publish'
                      });
                    }, 1000)
                  }
                })
              } else {
                wx.showToast({
                  title: '上传错误，请重试',
                  icon: 'none'
                })
              }
            }
          })
        },
        fail: function (err) {
          wx.hideLoading(() => {
            wx.showToast({
              title: '上传错误，请重试',
              icon: 'none'
            })
          })
        }
      })
    } else {
      wx.showToast({
        title: '请先录音',
        icon: 'none'
      })
    }
  },
  onStart: function() {
    let self = this;
    let timeFN = null;
    if (this.data.isRecording) {
      this.setData({
        isRecording: false,
      })
      recorder.recorderManager.stop()
    } else {
      // this.getUser('123456789');
      this.setData({
        recordTime: '00:00:00',
        isRecording: true
      })
      recorder.recorderManager.start(recorder.options);
      let hour, minute, second, totalMinSecond; //时 分 秒
      totalMinSecond = hour = minute = second = 0; //初始化
      timeFN = setInterval(function() {
        if (!self.data.isRecording) {
          clearInterval(timeFN);
        }
        totalMinSecond += 500;
        second += 0.5;
        console.log(second)
        if (second >= 60) {
          second = 0;
          minute = minute + 1;
        }

        if (minute >= 60) {
          minute = 0;
          hour = hour + 1;
        }
        let hour_, minute_, second_;
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
        if (totalMinSecond % 1000 == 0) {
          self.setData({
            recordTime: hour_ + ":" + minute_ + ":" + second_
          });
        }

      }, 500)
      // recorder.resetTimer(this)

    }
  },
  play(e) {
    if (this.data.isRecording) return false;
    innerAudioContext.autoplay = true;
    innerAudioContext.src = this.data.tempFilePath;
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res, res.errMsg)
      console.log(res.errCode)
    })
  },

})