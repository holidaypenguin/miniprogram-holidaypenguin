// miniprogram/pages/cashGiftStream/cashGiftStream.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    userList: [],
    projectList: [],
    streamList: [],

    projectOption: [
      { text: '全部事件', value: 0 },
    ],
    projectValue: 0,
    projectObj: {},

    userOption: [
      { text: '全部人', value: 0 },
    ],
    userValue: 0,
    userObj: {},

    typeObj: {
      1: '+',
      2: '-',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: async function () {

    await this.onQueryProject()
    await this.onQueryUser()
    await this.onQueryStream()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  onQueryStream: async function () {
    const db = wx.cloud.database()
    const params = {}
    this.data.projectValue && (params.projectId = db.command.eq(this.data.projectValue))
    this.data.userValue && (params.userId = db.command.eq(this.data.userValue))
    const res = await db.collection('cash_gift_stream')
      .where(params)
      // .orderBy('name', 'desc')
      // .limit(100)
      .get()
    
    this.setData({
      streamList: res.data
    })
    console.log('[数据库 cash_gift_stream] [查询记录] 成功: ', res)
  },

  onQueryProject: async function () {
    const db = wx.cloud.database()
    const res = await db.collection('cash_gift_project')
      // .orderBy('name', 'desc')
      // .limit(100)
      .get()
    
    this.setData({
      projectList: res.data,
      projectOption: [{ text: '全部事件', value: 0 }, ...(res.data || []).map(item => ({
        value: item._id,
        text: item.name,
      }))],
      projectObj: listToMap(res.data, '_id', 'name'),
    })
    console.log('[数据库 cash_gift_project] [查询记录] 成功: ', res)
  },

  onQueryUser: async function () {
    const db = wx.cloud.database()
    const res = await db.collection('cash_gift_user')
      // .orderBy('name', 'desc')
      // .limit(100)
      .get()
    
    this.setData({
      userList: res.data,
      userOption: [{ text: '全部人', value: 0 }, ...(res.data || []).map(item => ({
        value: item._id,
        text: `${item.name}${item.otherName ? '-' : ''}${item.otherName}`,
      }))],
      userObj: listToMap(res.data, '_id', 'name'),
    })
    console.log('[数据库 cash_gift_user] [查询记录] 成功: ', res)
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

function listToMap (list, key, label) {
  console.log('--listToMap--', list, key, label)
  const map = {}
  for (const item of list) {
    console.log(item)
    map[item[key]] = item
  }

  return map
}