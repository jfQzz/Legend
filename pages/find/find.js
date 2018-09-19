//index.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js")
Page({
  data: {
    imgUrls: [
      '/img/banner_1.png',
      '/img/banner_2.png'
    ],
    partnerImgs: [
      '/img/bg_test.jpg',
      '/img/bg_test.jpg',
      '/img/bg_test.jpg'
    ],
    adSpecial: [{
        img: '/img/ic_way.png',
        title: "丰富的资金渠道"
      },
      {
        img: '/img/ic_engy.png',
        title: "智能匹配引擎"
      },
      {
        img: '/img/ic_team.png',
        title: "专业服务团队"
      }
    ],
    ticketType: [
      "银票",
      "商票"
    ],
    tickets: [
      "电票",
      "纸票"

    ],
    banks: [
      "国股",
      "城商",
      "外贸",
      "农商",
      "农信",
      "农合",
      "村镇",
      "财务"
    ],
    selectTicketTypeIndex: 0,
    selectTicketIndex: -1,
    selectBankIndex: -1,
    amt: "",
    confirmer: "",
    date: "请选择票据到期日",
    imageTwo: "",
    imageOne: "",
    inputValue:"",
  },

  onTicketTypeSelect: function(res) {
    console.log(util.getPhone() + "           " + util.getToken())
    if (this.data.selectTicketTypeIndex == res.currentTarget.id) {
      return;
    }

    this.setData({
      selectTicketTypeIndex: res.currentTarget.id
    })


  },
  onBannerClick: function() {
    wx.navigateTo({
      url: '/pages/test/test'
    })


  },
  onTicketSelect: function(res) {
    console.log(res.currentTarget.id + "          " + this.data.selectTicketIndex)
    if (this.data.selectTicketIndex == res.currentTarget.id) {
      return;
    }

    this.setData({
      selectTicketIndex: res.currentTarget.id
    })


  },
  onBankSelect: function(res) {
    if (this.data.selectBankIndex == res.currentTarget.id) {
      return;
    }

    this.setData({
      selectBankIndex: res.currentTarget.id
    })
  },
  onDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  onFind: function() {
    if (!util.isLogin()){
      wx.showToast({
        title: '请前往登陆',
        icon: 'none',
        duration: 1500
      })
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }
    var name
    if (-1 == this.data.selectTicketIndex) {
      wx.showToast({
        title: '请选择票据介质',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (0 == this.data.selectTicketTypeIndex) {
      if (-1 == this.data.selectBankIndex) {
        wx.showToast({
          title: '请选择承兑行',
          icon: 'none',
          duration: 1500
        })
        return
      }
      name = this.data.banks[this.data.selectBankIndex]
    }

    if ("" == this.data.amt) {
      wx.showToast({
        title: '请输入票面金额',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if ("请选择票据到期日" == this.data.date) {
      wx.showToast({
        title: '请选择票据到期日',
        icon: 'none',
        duration: 1500
      })
      return
    }
    var currentDate = new Date()
    var hour = currentDate.getHours()
    var minutes = currentDate.getMinutes()
    var second = currentDate.getSeconds()
    var milliseconds = currentDate.getMilliseconds()
    currentDate = currentDate - hour * 3600 * 1000 - minutes * 60000 - second * 1000 - milliseconds
    if (currentDate > new Date(this.data.date).getTime()){
      wx.showToast({
        title: '票据到期时间小于当前时间',
        icon: 'none',
        duration: 1500
      })
      return
    }

    if (1 == this.data.selectTicketTypeIndex) {
      //承兑人
      if ("" == this.data.confirmer) {
        wx.showToast({
          title: '请输入承兑人全称',
          icon: 'none',
          duration: 1500
        })
        return
      }
      name = this.data.confirmer
    }

    if ("" == this.data.imageOne) {
      wx.showToast({
        title: '请选择票面图片',
        icon: 'none',
        duration: 1500
      })
      return
    }
    wx.getNetworkType({
      success: function(res) {
        if ('none' == res.networkType) {
          wx.showToast({
            title: '当前无网络',
            icon: 'error',
            duration: 1500
          })
          return;
        }
      }
    })
    var that = this
    var uploadUrl = app.data.hostUrl + 'type=inquiry&sourceid=xcx&data={"loginId":"' + util.getPhone() + '","tokenId":"' + util.getToken() + '","billType":"' + (parseInt(this.data.selectTicketTypeIndex) + 1) + '","billMedia":"' + (parseInt(this.data.selectTicketIndex) + 1) + '","billBank":"' + name + '","billAmt":"' + this.data.amt + '","dueDate":"' + this.data.date + '"}'
    console.log(this.data.imageOne + "         " + uploadUrl)
    wx.showLoading({
      title: '正在加载...',
    })
    wx.uploadFile({
      url: uploadUrl,
      filePath: that.data.imageOne,
      name: '1001',
      success: function(res) {
        wx.hideLoading()
        util.str2Json(res)
        var result = res.data
        console.log(result)
        var toastStr = result.message
        var toastState = 'none'
        if (1 == res.data.result) {
          toastStr = "提交成功,我们会及时与您联系！"
          toastState = 'none'
          // 清空当前的数据
          that.setData({
            selectTicketTypeIndex: 0,
            selectTicketIndex: -1,
            selectBankIndex: -1,
            amt: "",
            inputValue:"",
            confirmer: "",
            date: "请选择票据到期日",
            imageTwo: "",
            imageOne: "",

          })
        }
        wx.showToast({
          title: toastStr,
          icon: toastState,
          duration: 2000
        })

      },
      fail: function(errMsg) {
        console.log(errMsg)
        wx.hideLoading();
        wx.showToast({
          title: '提交失败',
          icon: 'none',
          duration: 1000
        })
        console.log('uploadImage fail, errMsg is', errMsg)
      }
    })

  },
  onAmtInput: function(e) {
    this.data.amt = e.detail.value
  },
  onConfirmerInput: function(e) {
    this.data.confirmer = e.detail.value
  },

  pickImage: function() {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        if (res.platform == "devtools") {
          that.androidPickImg()
        } else if (res.platform == "ios") {
          that.iosPickImg()
        } else if (res.platform == "android") {
          that.androidPickImg()
        }
      }
    })
  },
  iosPickImg: function() {
    var that = this
    var promise = new Promise(function(resolve, reject) {
      that.androidPickImg()
    });
  },
  androidPickImg: function() {
    var that = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      count: 1,
      success: function(res) {
        console.log(res)
        that.setData({
          imageOne: res.tempFilePaths[0],
        })
      }
    })
  },
  previewImage: function(e) {
    var current = e.target.dataset.src
    var imgs = [
      current
    ]
    wx.previewImage({
      urls: imgs
    })
  },
  deletePic: function(e) {
    console.log(e)
    if (0 == e.currentTarget.dataset.id) {
      this.setData({
        imageOne: ""
      })
    } else {
      this.setData({
        imageTwo: ""
      })
    }

  },

  onShareAppMessage: function () {
     return  {
      title: '聚萤金链-票据查询',
       path: '/pages/find/find'
    }
  }

})