//app.js
import { promisifyAll, promisify } from './utils/miniprogram-api-promise/src/index';

const wxp = {}
// promisify all wx's api
promisifyAll(wx, wxp)
// console.log(wxp.getSystemInfoSync())
// wxp.getSystemInfo().then(console.log)

App({
  wxp,

  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // 此处请填入环境 ID, 环境 ID 可打开云控制台查看
        env: 'prod-6whap',
        traceUser: true,
      })
    }

    this.globalData = {}
  }
})
