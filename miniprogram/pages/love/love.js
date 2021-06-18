// miniprogram/pages/love/love.js
const DU = 'cloud://prod-6whap.7072-prod-6whap-1259566406/heart01.png'; // default url
// const DU = 'https://preview.qiantucdn.com/58pic/35/05/07/01558PICnCPDP50c1QjEm_PIC2018.jpg!w1024_new_small'; // default url

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [
      [DU, DU, DU, DU],
      [DU, DU, DU, DU, DU, DU],
      [DU, DU, DU, DU, DU, DU, DU],
      [DU, DU, DU, DU, DU, DU, DU],
      [DU, DU, DU, DU, DU, DU, DU],
      [DU, DU, DU, DU, DU, DU, DU],
      [DU, DU, DU, DU, DU, DU, DU],
      [DU, DU, DU, DU, DU, DU],
      [DU, DU, DU, DU],
    ],
    imageShowList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(0, 0)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getData(row, col){
    let rowData = this.data.imageList[row];
    if(!rowData) return;

    let colData = rowData[col];

    if(colData){
      console.log(row, col)
      let showRowData = this.data.imageShowList[row] || [];
      showRowData[col] = colData;
      this.data.imageShowList[row] = showRowData;
      this.setData({
        imageShowList: this.data.imageShowList
      })
      setTimeout(()=>{
        this.getData(row, col + 1)
      }, 300)
    }else{
      // setTimeout(() => {
        this.getData(row + 1, 0)
      // }, 300)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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