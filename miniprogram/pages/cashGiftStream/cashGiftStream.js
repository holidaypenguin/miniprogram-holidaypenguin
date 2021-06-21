// miniprogram/pages/cashGiftStream/cashGiftStream.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    userList: [],
    projectList: [],
    streamList: [],
    streamCount: 0,

    projectOption: [
      { text: '全部事件', value: 0 },
    ],
    projectOptionInput: [],
    projectValue: 0,
    projectObj: {},

    userOption: [
      { text: '全部人', value: 0 },
    ],
    userOptionInput: [],
    userValue: 0,
    userObj: {},

    typeObj: {
      1: '+',
      2: '-',
    },

    addPersionVisible: false,
    persionName: '',
    persionOtherName: '',

    addStreamVisible: false,
    streamMoney: '',
    streamProjectId: '',
    streamProjectName: '',
    streamRemark: '',
    streamPersionId: '',
    streamPersionName: '',
    addStreamProjectVisible: false,
    addStreamPersionVisible: false,
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

  // 查询全部礼金
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
      streamList: res.data,
      streamCount: this.getStreamCount(res.data),
    })
    console.log('[数据库 cash_gift_stream] [查询记录] 成功: ', res)
  },

  // 计算礼金总和
  getStreamCount (list = []) {
    if (!this.data.userValue) return 0
    
    let count = 0

    for (const item of list) {
      if (item.type == 1) {
        count += Number(item.money)
      } else if (item.type == 2) {
        count -= Number(item.money)
      }
    }

    return count
  },

  // 查询全部事件
  onQueryProject: async function () {
    const db = wx.cloud.database()
    const res = await db.collection('cash_gift_project')
      // .orderBy('name', 'desc')
      // .limit(100)
      .get()
    
    this.setData({
      projectList: res.data,
      projectOption: [{ text: '全部事件', value: 0 }, ...(res.data || []).filter(item => item.type == 1).map(item => ({
        value: item._id,
        text: item.name,
      }))],
      projectOptionInput: (res.data || []).map(item => ({
        value: item._id,
        text: item.name,
      })),
      projectObj: listToMap(res.data, '_id', 'name'),
    })
    console.log('[数据库 cash_gift_project] [查询记录] 成功: ', res)
  },

  // 查询全部人
  onQueryUser: async function () {
    const db = wx.cloud.database()
    const res = await db.collection('cash_gift_user')
      .orderBy('name', 'asc')
      // .limit(100)
      .get()
    
    const options = (res.data || []).map(item => ({
      value: item._id,
      text: `${item.name}${item.otherName ? '-' : ''}${item.otherName}`,
    }))
    
    this.setData({
      userList: res.data,
      userOption: [{ text: '全部人', value: 0 }, ...options],
      userOptionInput: [...options],
      userObj: listToMap(res.data, '_id', 'name'),
    })
    console.log('[数据库 cash_gift_user] [查询记录] 成功: ', res)
  },

  // trigger添加人
  async triggerAddPersion () {
    // console.log('--triggerAddPersion--')
    this.setData({
      addPersionVisible: !this.data.addPersionVisible
    })
  },

  // trigger添加事件
  triggerAddStream () {
    // console.log('--triggerAddStream--')
    this.setData({
      addStreamVisible: !this.data.addStreamVisible
    })
  },

  // trigger选择事件
  triggerAddStreamProject () {
    this.setData({
      addStreamProjectVisible: !this.data.addStreamProjectVisible
    })
  },
  addStreamProjectConfirm (e) {
    this.setData({
      streamProjectId: e.detail.value.value,
      streamProjectName: e.detail.value.text,
      addStreamProjectVisible: false,
    })
  },

  triggerAddStreamPersion () {
    this.setData({
      addStreamPersionVisible: !this.data.addStreamPersionVisible
    })
  },
  addStreamPersionConfirm (e) {
    this.setData({
      streamPersionId: e.detail.value.value,
      streamPersionName: e.detail.value.text,
      addStreamPersionVisible: false,
    })
  },

  addProject () {},

  // 添加一个个人
  async addPersionOnlyHandler () {
    await this.addPersionNextHandler()
    this.triggerAddPersion()
  },
  // 连续添加人
  async addPersionNextHandler () {
    if (this.adding) return
    this.adding = true
    await app.wxp.showLoading({
      title: '添加中',
      mask: true,
    })
    await this.addPersion(this.data.persionName, this.data.persionOtherName).catch(e => {
      this.adding = false

      return Promise.reject(e)
    })
    this.cleanPersionMsg()

    this.adding = false

    wx.hideLoading({
      success: (res) => {},
    })
  },
  // 添加人保存到数据库
  async addPersion (name = '', otherName = '') {
    if (!name) {
      wx.showToast({
        title: '请输入人名字',
      })
      return Promise.reject()
    }
    const db = wx.cloud.database()
    await db.collection('cash_gift_user').add({
      data: {
        name,
        otherName,
      }
    })

    await this.onQueryUser()
  },
  // 清空人输入信息
  cleanPersionMsg () {
    this.setData({
      persionName: '',
      persionOtherName: '',
    })
  },

  // 添加一个事件
  async addStreamOnlyHandler () {
    await this.addStreamNextHandler()
    this.triggerAddStream()
  },
  // 连续添加事件
  async addStreamNextHandler () {
    if (this.adding) return
    this.adding = true
    await app.wxp.showLoading({
      title: '添加中',
      mask: true,
    })
    await this.addStream(
      this.data.streamMoney,
      this.data.streamProjectId,
      this.data.streamRemark,
      this.data.projectObj[this.data.streamProjectId]?.type,
      this.data.streamPersionId,
    ).catch(e => {
      this.adding = false

      return Promise.reject(e)
    })
    this.cleanStreamMsg()

    this.adding = false

    wx.hideLoading({
      success: (res) => {},
    })
  },
  // 添加礼金保存到数据库
  async addStream (money = 0, projectId = '', remark = '', type = '2', userId = '') {
    if (!money || !projectId || !userId) {
      wx.showToast({
        title: '除了备注请完整填写',
      })
      return Promise.reject()
    }
    const db = wx.cloud.database()
    await db.collection('cash_gift_stream').add({
      data: {
        money,
        projectId,
        remark,
        type,
        userId,
      }
    })

    await this.onQueryStream()
  },
  // 清空礼金输入信息
  cleanStreamMsg () {
    this.setData({
      streamMoney: '',
      streamProjectId: '',
      streamProjectName: '',
      streamRemark: '',
      streamPersionId: '',
      streamPersionName: '',
    })
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
  // console.log('--listToMap--', list, key, label)
  const map = {}
  for (const item of list) {
    map[item[key]] = item
  }

  return map
}