function formatTime (date ,index) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
if(0 == index){
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}else{
  return [year, month, day].map(formatNumber).join('-') 
}
 
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//get请求
function doGet(url, successCallback, errorCallback, isNeedLoading, index) {
  // //判断当前网络状态
  wx.getNetworkType({
    success: function(res) {
      if ('none' == res.networkType) {
        toast('当前无网络', 'loading');
        return;
      }
    }
  })
  if (isNeedLoading) {
    wx.showLoading({
      title: '正在加载...',
    })
  }
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'content-type': 'json'
    },
    success: function(res) {
      if (isNeedLoading) {
        wx.hideLoading();
      }
       console.log(res)
      if (null != res && 200 == res.statusCode) {
        successCallback(res.data, index);
      } else {
        toast('数据获取失败', 'loading');
      }
    },
    fail: function() {
      errorCallback(index)
      toast('服务器连接失败', 'loading');
    }
  })
}

//get请求
function upLoadPic(url, successCallback, isNeedLoading) {
  // //判断当前网络状态
  wx.getNetworkType({
    success: function(res) {
      if ('none' == res.networkType) {
        toast('当前无网络', 'loading');
        return;
      }
    }
  })
  if (isNeedLoading) {
    wx.showLoading({
      title: '正在加载...',
    })
  }
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'content-type': 'json'
    },
    success: function(res) {
      if (isNeedLoading) {
        wx.hideLoading();
      }
      if (null != res && 200 == res.statusCode) {
        successCallback(res.data);
      } else {
        toast('数据获取失败', 'loading');
      }
    },
    fail: function() {
      toast('服务器连接失败', 'loading');
    }
  })
}
//样式只有 success 和 loading,默认success
function toast(title, style) {
  wx.showToast({
    title: title,
    icon: style,
    duration: 1200
  });
}

function saveToken(token) {
  wx.setStorageSync("tokenId", token)
}

function savePhone(phone) {
  wx.setStorageSync("phone", phone)
}

function getPhone() {
  return wx.getStorageSync("phone")
}

function getToken() {
  return wx.getStorageSync("tokenId")
}
function isLogin(){
  return getToken().length > 0 ? true:false
}

function str2Json(result) {
  var jsonStr = result.data;
  jsonStr = jsonStr.replace(" ", "");
  if (typeof jsonStr != 'object') {
    jsonStr = jsonStr.replace(/\ufeff/g, "");
    var jj = JSON.parse(jsonStr);
    result.data = jj;
  }
}

  module.exports = {
    formatTime: formatTime,
    doGet: doGet,
    saveToken: saveToken,
    savePhone: savePhone,
    getPhone: getPhone,
    getToken: getToken,
    str2Json: str2Json,
    isLogin: isLogin,
  }