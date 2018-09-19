// pages/about/about.js
Page({

      /**
       * 页面的初始数据
       */
      data: {
        userListInfo: [{
          icon: '/img/ic_net.png',
            text: '官方网站',
          hint: "www.smmerz.com"
          }, {
            icon: '/img/ic_phone2.png',
            text: '客服电话',
            hint: "400-999-2278"
          }, {
            icon: '/img/ic_message.png',
            text: '邮箱',
            hint: "smmerz.jy@vteamsystem.com"
          }
        ]
      },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {

        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {

        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {

        },

        /**
         * 生命周期函数--监听页面隐藏
         */
        onHide: function() {

        },

        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function() {

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
            path: '/pages/about/about'
          }
        },
  onCodeClick:function(){
    wx.navigateTo({
      url: '/pages/webview/webview',
    })
  }
      })