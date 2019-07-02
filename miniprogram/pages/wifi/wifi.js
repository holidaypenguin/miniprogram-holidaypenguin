// miniprogram/pages/wifi/wifi.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryResult: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onQuery();
    this.onGetOpenid();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  onQuery: function () {
    const db = wx.cloud.database()
    // 查询当前用户所有的 wifi
    db.collection('wifi')
      .orderBy('index', 'desc')
      .limit(100)
      .get()
      .then(res => {
        this.setData({
          queryResult: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      })
  },

  itemHandler({ currentTarget: { dataset: {index} }} = {}){
    console.log(index)
    this.wxStartWifi(index);
  },

  wxStartWifi(index) {
    console.log('--启动wifi--');
    if(this.wifiStart) {
      this.wxConnectWifi(index);
    }else{
      wx.startWifi({
        success: (res) => {
          this.wifiStart = true;
          console.log(res.errMsg)
          this.wxConnectWifi(index);
        }
      })
    }
  },

  wxConnectWifi(index){
    let data = this.data.queryResult[index];
    console.log(`--连接${data.name}wifi--`);

    wx.connectWifi({
      SSID: data.ssid,
      password: data.password,
      success: (res) => {
        console.log(res.errMsg)
      },
      fail: (res) => {
        wx.showToast({
          icon: 'none',
          title: res.errMsg
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    setTimeout(()=>{
      // this.onQuery();
    }, 2000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})