// pages/login/login.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: '',
    countDownNum: '获取验证码',
    isStartTimeDown: false,
    phone: 1,
    code: 1,
    isLogin: false,
    loginHint: "登录",
    isStop: false,
    loginMark: 0,
  },

  onLogin: function() {
    if (0 == this.data.loginMark) return
    var url = app.data.hostUrl + 'type=login&sourceid=xcx&data={"loginId":"' + this.data.phone + '","phoneCode":"' + this.data.code + '"}';
    console.log(url)
    util.doGet(url, this.successCallback, this.errorCallback, true, 0);
    this.setData({
      isLogin: true,
      loginHint: "正在登录..."
    })
  },

  //   网络请求回调
  successCallback: function(result, index) {
    if (0 == index) {
      if (result.result == 1) {
        this.setData({
          isLogin: false,
          loginHint: "欢迎回来"
        })
        clearInterval(this.data.timer);
        this.data.isStop = true
        app.data.tokenId = result.data.tokenId
        app.data.phone = this.data.phone
        util.saveToken(result.data.tokenId)
        util.savePhone(app.data.phone)
        console.log(result.data.tokenId + "    tokenId    " + app.data.tokenId)
        wx.navigateBack()
      } else {
        this.setData({
          isLogin: false,
          loginHint: null == result.message ? "登录失败" : result.message
        })
        wx.showToast({
          title: null == result.message ? "登录失败" : result.message,
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      if (result.result == 1) {
        wx.showToast({
          title: "验证码发送成功",
          icon: 'success',
          duration: 2000
        })
        this.data.countDownNum = 90
        this.data.isStartTimeDown = true
        this.countDown()
      } else {
        wx.showToast({
          title: null == result.message ? "验证码发送失败" : result.message,
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  errorCallback: function(index) {
    if (0 == index) {
      this.setData({
        isLogin: true,
        loginHint: "登录失败"
      })
    } else {
      wx.showToast({
        title: '验证码发送失败',
        icon: 'none',
        duration: 1500
      })
    }
  },

  onGetCode: function() {
    if ("获取验证码" != this.data.countDownNum && "重新获取验证码" != this.data.countDownNum) return
    if (null == this.data.phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (11 != this.data.phone.length) {
      wx.showToast({
        title: '手机号不符合规范',
        icon: 'none',
        duration: 1500
      })
      return
    }
    //获取验证码
    var url = app.data.hostUrl + 'type=sendSms&sourceid=xcx&data={"loginId":"' + this.data.phone + '"}';
    this.setData({
      loginHint:"登录"
    })
    console.log(url)
    util.doGet(url, this.successCallback, this.errorCallback, true, 1);

  },
  onPhoneInput: function(e) {
    this.data.phone = e.detail.value
    this.onChangeLoginState()
  },
  onCodeInput: function(e) {
    this.data.code = e.detail.value
    this.onChangeLoginState()
  },

  onChangeLoginState: function() {
    var mark
    if (11 == (this.data.phone + "").length && 4 == (this.data.code + "").length && ('获取验证码' != this.data.countDownNum && '重新获取验证码' != this.data.countDownNum))  {
      if (1 == this.data.loginMark) return
      else mark = 1
    } else {
      if (0 == this.data.loginMark) return
      else
        mark = 0
    }
    this.setData({
      loginMark: mark
    })
  },



  countDown: function() {
    console.log(this.data.isStop + "      " + this.data.countDownNum)
    if (!this.data.isStartTimeDown || this.data.isStop) return
    let countDownNum = this.data.countDownNum;
    let that = this;
    if (null != this.data.timer) clearInterval(this.data.timer)
    this.setData({
      timer: setInterval(function() {
        countDownNum--;
        that.setData({
          countDownNum: countDownNum
        })
        if (countDownNum == 0) {
          clearInterval(that.data.timer);
          that.setData({
            countDownNum: '重新获取验证码',
            isStartTimeDown: false,
            loginMark: 0
          })
          if (that.data.isStartTimeDown && !this.data.isStop) {
            wx.showToast({
              title: '验证码超时',
              icon: 'none',
              duration: 1500
            })
          }
        }
      }, 1000)
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '聚萤金链-票据查询',
      path: '/pages/login/login'
    }
  }
})