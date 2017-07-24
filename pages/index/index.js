// index.js
// 获取应用实例
var app = getApp()

Page({
  data: {
    cover: '',
    city: '',
    cond: '',
    tmp: '',
    time: ''
  },
  // 事件处理函数
  onLoad: function () {
    this.getLocation();
  },
  // 获取经纬度坐标
  getLocation: function(){
    let page = this
    wx.getLocation({
      type: 'wgs84', // 以wgs84格式获取坐标
      success: function(res) {
        //console.log(res)
        let longitude= res.longitude
        let latitude = res.latitude
        page.getDistrict(longitude,latitude)
      },
    })
  },
  // 获取含街道信息的精确位置，并制作静态图
  getDistrict: function (longitude, latitude){
    let page = this
    let ak = '9e32c7739ec43b4cb11b5c922317c8ef' // 高德开发者密钥
    // 获取定位静态图
    wx.getSystemInfo({
      success: function (data) {
        var height = 220;
        var width = data.windowWidth; // 计算屏幕宽度
        var size = width + "*" + height;
        // 返回定位静态图地址
        let cover_url = 'https://restapi.amap.com/v3/staticmap?location=' + longitude + ',' + latitude + '&markers=mid,,A:' + longitude + ',' + latitude + '&zoom=12&size=' + size + '&key=' + ak
        page.setData({
          cover_width: width,
          cover: cover_url
        })
      }
    })
    wx.request({
      // 返回定位位置逆解析结果
      url: 'https://restapi.amap.com/v3/geocode/regeo?location=' + longitude + ',' + latitude + '&key=' + ak,
      success: function(res){
        //console.log(res)
        let city = res.data.regeocode.addressComponent.city
        let district = res.data.regeocode.addressComponent.district
        let township = res.data.regeocode.addressComponent.township
        page.setData({
          city: district + ' · ' + city,
        })
        page.getWeather(district)
      }
    })
  },
  // 获取定位地址实时天气
  getWeather: function(city) {
    let page = this
    let ak = '03f946369e324488b0cb85a0e5a6bfe0' // 和风天气开发者密钥
    wx.request({
      // 获取当前行政区域内实时天气
      url: 'https://free-api.heweather.com/v5/now?city=' + district + '&key='+ ak,
      success: function(res){
        console.log(res)
        let cond_txt = res.data.HeWeather5["0"].now.cond.txt
        let cond_code = res.data.HeWeather5["0"].now.cond.code
        let tmp = res.data.HeWeather5["0"].now.tmp
        let update_loc = res.data.HeWeather5["0"].basic.update.loc
        page.setData({
          cond: cond_txt,
          icon: 'http://wechatapp.b0.upaiyun.com/weather/' + cond_code + '.png',
          tmp: tmp + '℃',
          update: '数据更新自 ' + update_loc,
        })
      }
    })
  }
})
