const app = getApp();
import recorder from '../../lib/recorderManager.js';
const innerAudioContext = wx.createInnerAudioContext();

Page({
  data: {
    uploading:false,
    imagePath:'',
    hasImg:false,
    promise:false
  },
  onLoad: function (options) {
  }, 
  selectPH(){
    let _self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        _self.setData({
          imagePath: res.tempFilePaths[0],
          hasImg:true
        })
        let path = res.tempFilePaths[0];
        app.globalData.form['imgExt'] = path.split(".").splice(-1)[0];
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],
          encoding:'base64',
          success:res=>{
            app.globalData.form['img'] = 'data:image/png;base64,' + res.data;
          }
        });
        
      }
    }) 
  },
  upload(){
    if(this.data.uploading)return false;
    this.setData({
      "uploading":true
    })
  },
  resetGlobalData(){
    app.globalData.form['unionId'] = -1;
    app.globalData.form['img'] = '';
    app.globalData.form['name'] =  '';
    app.globalData.form['author'] =  '';
    app.globalData.form['description'] =  '';
    app.globalData.form['age'] =  '';
    app.globalData.form['type'] =  1;
    app.globalData.form['recommendDesc'] =  '';
    app.globalData.form['imgExt'] =  '';
  },
  formSubmit(e){
    const self = this;
    if(!this.data.promise){
      wx.showToast({
        title: '请阅读并同意《知识产权承诺》。',
        icon: 'none'
      })
      return;
    }
    if (app.globalData.form.imgurl==""){
      wx.showToast({
        title: '请选择图片',
        icon:'none'
      })
      return;
    } else if (e.detail.value['title']==""){
      wx.showToast({
        title: '请输入书名或标题',
        icon: 'none'
      })
      return;
    } else if (e.detail.value['share'] == ""){
      wx.showToast({
        title: '请输入书名或标题',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '正在上保存录音。。。',
    })
    app.globalData.form['name'] = e.detail.value.title;
    app.globalData.form['recommendDesc'] = e.detail.value.share;
 
    wx.uploadFile({
      url:'https://xshishu.com/wxapp/book/addBookInfo',
      filePath: app.globalData.recordUrl,
      name:'voiceurl',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: { ...app.globalData.form},
      success:function(res){
        let data = JSON.parse(res.data);
        app.globalData.bookid=data.result;
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
                    });},1000)
                }
              })
            }else{
              wx.showToast({
                title: '上传错误，请重试',
                icon: 'none'
              }) 
            }
          }
        })
      },
      fail:function(err){
        wx.hideLoading(()=>{
          wx.showToast({
            title: '上传错误，请重试',
            icon: 'none'
          }) 
        })
      }
    })
  },
  checkedPRO(){
    this.setData({
      promise:true
    })
  },
  cancelPRO(){
    this.setData({
      promise:false
    })
  },
  togglePRO(){
    if(this.promise){
      this.setData({
        promise: false
      })
    }else{
      this.setData({
        promise: true
      })
    }
  },
  showPromise() {
    wx.navigateTo({
      url: '../book/book'
    })
    return;
  }
  
})