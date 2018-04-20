<template>
  <div class="main">
    <section class="input-box">
      <h3 class="input-box-title" :class="{'on-share': confirm}">出发地点</h3>
      <div class="get-loc" v-if="!confirm">
        <input class="input-box-input get-loc-input" placeholder="填写或选择出发地点" v-model="from" type="text">
        <button class="get-loc-btn" @click="getLocation('from')">获取位置</button>
      </div>
      <p class="input-box-detail" v-if="confirm">{{from}}</p>
    </section>
    <section class="input-box">
      <h3 class="input-box-title" :class="{'on-share': confirm}">目的地点</h3>
      <div class="get-loc" v-if="!confirm">
        <input class="input-box-input get-loc-input" placeholder="填写或选择目的地点" v-model="to" type="text">
        <button class="get-loc-btn" @click="getLocation('to')">获取位置</button>
      </div>
      <p class="input-box-detail" v-if="confirm">{{to}}</p>
    </section>
    <section class="input-box">
      <h3 class="input-box-title" :class="{'on-share': confirm}">预计出发时间</h3>
      <picker v-if="!confirm" class="input-box-input" mode="time" start="07:00" end="24:00" v-model="time" @change="onTimeChanged">
        <p class="picker">
          {{time}}
        </p>
      </picker>
      <p class="input-box-detail" v-if="confirm">{{time}}</p>
    </section>
    <section class="input-box">
      <h3 class="input-box-title" :class="{'on-share': confirm}">车辆信息</h3>
      <image class="input-box-img_preview" @click="chooseImg" :src="imgSrc" mode="widthFix"></image>
    </section>
    <div class="input-box">
      <button class="input-box-btn" v-if="!confirm && from && to" @click="submit">确定拼车单</button>
      <button class="input-box-btn" v-if="confirm" open-type="share">分享到群</button>
    </div>

    <t-dialog
      :show.sync="showDialog"
      ></t-dialog>
  </div>
</template>

<script>
import wx from 'utils/wx'
import dialog from 'comp/dialog-index'

export default {
  data () {
    return {
      imgSrc: require('static/imgs/img-holder.jpg'),
      confirm: false,
      time: '00:00',
      from: '',
      to: '',
      billId: '',
      userInfo: {},
      showDialog: false
    }
  },
  computed: {
    billInfo () {
      return {
        time: this.time,
        from: this.from,
        to: this.to,
        billId: this.billId
      }
    }
  },
  async onShow () {
    this.confirm = false
    wx.getStorage('is-first').then((res) => {
      // 非第一次使用，不展示说明
    }).catch((e) => {
      // 是第一次使用，展示说明并设置storage
      this.showDialog = true
      wx.setStorage('is-first', 'true')
    })
    // 进来的时候先获取用户信息
    // 然后用userId去判断是否已经处于拼单
    // 若是，则跳转到对应拼单billId的拼单详情页
    // 若否，则允许新建拼单
    this.userInfo = await this.$store.dispatch('getUserInfo')
    const inBill = await this.$store.dispatch('checkInBill', this.userInfo.userId)

    if (inBill.inBill) {
      wx.redirectTo(`../join/main?billId=${inBill.inBill.billId}&fromIndex=true`)
    }
  },
  onShareAppMessage (result) {
    let title = '一起拼车'
    let path = '/pages/index'
    if (result.from === 'button') {
      this.billId = 'billId-' + new Date().getTime()
      title = '我发起了一个拼车'
      path = `pages/join/main?billId=${this.billId}`
    }
    return {
      title,
      path,
      success: async (res) => {
        console.log(`分享成功，此次path为：${path}`)
        await this.$store.dispatch('createBill', { ...this.userInfo, ...this.billInfo })

        // 上传图片
        await this.$store.dispatch('uploadImg', {
          filePath: this.imgSrc,
          billId: this.billId
        })

        wx.redirectTo(`../join/main?billId=${this.billId}`)
      },
      fail (e) {
        console.log(e)
      }
    }
  },
  methods: {
    onTimeChanged (e) {
      this.time = e.target.value
    },
    async getLocation (type) {
      const { name } = await wx.chooseLocation()
      this[type] = name
    },
    async chooseImg () {
      if (!this.confirm) {
        const res = await wx.chooseImage()
        this.imgSrc = res.tempFilePaths[0]
      }
    },
    submit () {
      this.confirm = true
    }
  },
  components: {
    't-dialog': dialog
  }
}
</script>

<style lang="less">
.main {
  position: relative;
  min-height: 100vh;
  padding: 30rpx;
  .input-box {
    margin-bottom: 30rpx;
    .get-loc {
      display: flex;
      &-input {
        flex: 1;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        font-size:28rpx;
      }
      &-btn {
        width: 30%;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 0 4rpx 4rpx 0;
        background: #4fc3f7;
        border-left: none;
        font-size: 28rpx;
        color: #fff;
        &:after {
          border: none;
        }
        &:active {
          opacity: .9;
        }
      }
    }
    &-title {
      color: #aaa;
      font-size: 20rpx;
      margin-bottom: 10rpx;
      &.on-share {
        font-size: 26rpx;
      }
    }
    &-input {
      height: 80rpx;
      line-height: 80rpx;
      background-color: #fff;
      padding: 10rpx;
      box-sizing: border-box;
      border: 2rpx solid #4fc3f7;
      border-radius: 4rpx;
      .picker {
        height: 60rpx;
        line-height: 60rpx;
      }
    }
    &-detail {
      font-size: 56rpx;
    }
    &-img_preview {
      width: 100%;
    }
    &-btn {
      background: #4fc3f7;
      font-size: 28rpx;
      border: none;
      border-radius: 4rpx;
      color: #fff;
      &:active {
        opacity: .9;
      }
      &:after {
        border: none;
      }
    }
  }
}
</style>
