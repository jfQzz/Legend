// pages/history/history.js
var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    tabs: ['银票', '商票'],
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false,
      currentOffsetLeft: 0,
    },
    sliverList: [],
    businessList: [],
    list: [],
    sliverPageNo: 1,
    businessPageNo: 1,
    currentY: 9,
    currentTab: 0,
    activeTab: 0,
    endHint: "正在加载...",
    isFirstLoad: true,
    isSliverLoadmoreEnd: false,
    isBusinessLoadmoreEnd: false,
  },
  onLoad: function(options) {
    try {
      let {
        tabs
      } = this.data;
      var res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      // this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
      this.data.stv.lineWidth = 10;
      this.data.stv.windowWidth = res.windowWidth;
      this.setData({
        stv: this.data.stv
      })
      this.tabsCount = tabs.length;
    } catch (e) {}
    this.loadData(0,true)
    this.loadData(1,true)
  },

  loadData: function(index,needLoading) {
    var pageNo = 0 == index ? this.data.sliverPageNo : this.data.businessPageNo
    var url = app.data.hostUrl + 'type=inquiryList&sourceid=xcx&data={"loginId":"'+util.getPhone()+'","tokenId":"'+ util.getToken()+'", "pageNum":"'+pageNo+'", "pageSize":"10","source":"X","billType":"'+(parseInt(index) + 1)+'"}';
    console.log(url)
    util.doGet(url, this.successCallback, this.errorCallback, needLoading, index);
  },

  successCallback: function(result, index) {
    wx.stopPullDownRefresh()
    if (1 == result.result) {
      if (null != result.data) {
        if (0 < result.data.jsonMap.rows.length) {
          this.formatData(result.data.jsonMap.rows)
          this.setListData(result.data.jsonMap.rows, index)
        } else {
          if (0 == index)
            this.data.isSliverLoadmoreEnd = true
          else
            this.data.isBusinessLoadmoreEnd = true
          this.setData({
            endHint: "已全部加载"
          })
        }
      }
    }
  },

  errorCallback: function(index) {
    wx.stopPullDownRefresh()
    wx.showToast({
      title: '查询历史失败，请稍后重试',
      icon: 'none',
      duration: 1500
    })
  },

  setListData: function(resultList, index) {
    console.log(index + "                     " + (this.data.isFirstLoad) + "         " + resultList.length)
    var currentList
    if (( 0 == index && 1 == this.data.sliverPageNo) || (1 == index && 1 == this.data.businessPageNo) ) {
      this.data.list =0
    } else {
      if (0 == index) {
        resultList = this.data.sliverList.concat(resultList)
      } else {
        resultList = this.data.businessList.concat(resultList)
      }
    }
    if (this.data.isFirstLoad) {
      if (0 == index) {
        this.setData({
          list: resultList,
          sliverList: resultList,
          endHint: 4 < resultList.length ? "正在加载..." : "已全部加载"
        })
      } else {
        this.setData({
          businessList: resultList,
          endHint: 4 < resultList.length ? "正在加载..." : "已全部加载"
        })
        console.log(this.data.businessList.length)
      }
    } else {
      if (0 == this.data.currentTab) {
        this.setData({
          list: resultList,
          sliverList: resultList,
          endHint: 4 < resultList.length ? "正在加载..." : "已全部加载"
        })
      } else {
        this.setData({
          list: resultList,
          businessList: resultList,
          endHint: 4 < resultList.length ? "正在加载..." : "已全部加载"
        })
      }
    }
  },

  _updateSelectedPage(page) {
    let {
      tabs,
      stv,
      activeTab
    } = this.data;
    activeTab = page;
    this.setData({
      activeTab: activeTab
    })
    stv.offset = stv.windowWidth * activeTab;
    this.setData({
      stv: this.data.stv
    })
  },
  //传入list
  formatData: function(result) {
    var currentDate = new Date()
    var hour = currentDate.getHours()
    var minutes = currentDate.getMinutes()
    var second = currentDate.getSeconds()
    var milliseconds = currentDate.getMilliseconds()
    currentDate = currentDate - hour * 3600 * 1000 - minutes * 60000 - second * 1000 - milliseconds
    console.log("currentDate        " + new Date(currentDate).getTime() + "       " + util.formatTime(new Date(currentDate), 0))

    var currentTime = currentDate

    for (var i = 0; i < result.length; i++) {
      var item = result[i]
      var billMedia = item.billMedia
      var uuid = item.uuid
      var billAmt = item.billAmt
      var createDate = item.createDate
      var billBank = item.billBank
      var dueDate = item.dueDate
      var remainTime = new Date(dueDate).getTime() 
      var hint
      if (currentTime > remainTime){
            hint = "已过期"
      }else{
        var time = (remainTime- currentTime ) / (24 * 3600 * 1000);
        if(time >=1){
          hint = "剩余" + Math.round(time) + "天" 
        }else{
          hint = "即将到期"
        }
      }
      result[i] = {
        billMedia: billMedia,
        uuid: app.data.imgUrl + uuid,
        billAmt: billAmt,
        createDate: util.formatTime(new Date(createDate), 0),
        billBank: billBank,
        remainDay: hint,
        dueDate: util.formatTime(new Date(dueDate), 1),
      }
    }
  },
  handlerTabTap(e) {
    var index = e.currentTarget.dataset.index
    this._updateSelectedPage(index);
    if (this.data.currentTab == index)
      return
    var data
    if (0 == index) {
      data = this.data.sliverList
      console.log(this.data.sliverList)
    } else {
      data = this.data.businessList
      console.log(this.data.businessList)
    }
    this.setData({
      list: data,
      currentTab: index,
      endHint: 4 < data.length ? "正在加载..." : "已全部加载"
    })

  },

  onPullDownRefresh: function() {
    console.log("           onPullDownRefresh       ")
    if (0 == this.data.currentTab) {
      if (this.data.isSliverLoadmoreEnd) this.data.isSliverLoadmoreEnd = false
      if (0 == this.data.sliverList) {
        wx.stopPullDownRefresh()
        return
      } else this.data.sliverPageNo = 1
    } else {
      if (this.data.isBusinessLoadmoreEnd) this.data.isBusinessLoadmoreEnd = false
      if (0 == this.data.businessList) {
        wx.stopPullDownRefresh()
        return
      } else this.data.businessPageNo = 1
    }
    if (this.data.isFirstLoad = true) this.data.isFirstLoad = false;
    this.loadData(this.data.currentTab,false)
  },


  onReachBottom: function() {
    var pageNo
    if (0 == this.data.currentTab) {
      if (this.data.isSliverLoadmoreEnd)return
      pageNo = parseInt(this.data.sliverPageNo) + 1
      this.data.sliverPageNo = pageNo
    } else {
      if (this.data.isBusinessLoadmoreEnd)return
      pageNo = parseInt(this.data.businessPageNo) + 1
      this.data.businessPageNo = pageNo
    }
    if (this.data.isFirstLoad = true) this.data.isFirstLoad = false;
    this.loadData(this.data.currentTab,true)
  },
  onImgClick:function(e){
    wx.previewImage({
      urls: [e.target.dataset.url]
    })
  }
})