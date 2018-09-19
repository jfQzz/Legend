// pages/user/user.js
var app = getApp();
var util = require('../../utils/util.js')
Page({

  data: {
    userListInfo: [{
      icon: '/img/ic_history.png',
      text: '我的询价',
      isDetail: true,

    }, {
      icon: '/img/ic_about_us.png',
      text: '关于我们',
      isDetail: true,

    }, {
      icon: '/img/ic_contact_us.png',
      text: '联系客服',
      isDetail: false,
      hint: "400-999-2278"
    }],
    headIc: "/img/ic_user.png",
    loginState: "登录/注册",
  },

  onLogin: function() {
    if (util.isLogin()) {
      var that = this
      wx.showModal({
        content: '确定退出登录 ?',
        success: function (res) {
          if (res.confirm) {
            util.saveToken("")
            util.savePhone("")
            that.setData({
              loginState: "登录/注册",
              headIc: "/img/ic_user.png",
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }

  },

  onItemClick: function(res) {
    if (0 == res.currentTarget.dataset.id) {
      if (util.isLogin()) {
        wx.navigateTo({
          url: '/pages/history/history'
        })
      } else {
        wx.showToast({
          title: '请前往登录',
          icon: 'none',
          duration: 1500
        })
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
    } else if (1 == res.currentTarget.dataset.id) {
      wx.navigateTo({
        url: '/pages/about/about'
      })
    }

  },

  onShow: function() {
    if (util.isLogin()) {
      this.setData({
        loginState: "已登录",
        headIc: "/img/ic_head.png",
      })
    } else {
      this.setData({
        loginState: "登录/注册",
        headIc: "/img/ic_user.png",
      })
    }

  },


  onShareAppMessage: function() {
    return {
      title: '聚萤金链-票据查询',
      path: '/pages/user/user'
    }
  }
})