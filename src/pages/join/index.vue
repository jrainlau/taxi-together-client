<template>
  <div class="member">
    <h4 class="member-tips">下拉可刷新查看拼车成员</h4>
    <section class="member-list" v-for="(member, index) in billInfo.members" :key="index">
      <image class="member-list-avatar" :src="member.avatar"></image>
      <div class="member-list-desc">{{member.name}}</div>
    </section>

    <section class="member-list clickable" v-if="!inThisBill && billInfo.members && billInfo.members.length < 4" @click="joinBill">
      <image class="member-list-avatar" :src="avatarHolder"></image>
      <div class="member-list-desc">点击参与拼车</div>
    </section>

    <section class="member-detail">
      <h3 class="member-detail-title">出发地点</h3>
      <p class="member-detail-desc">{{billInfo.from}}</p>
      <h3 class="member-detail-title">目的地点</h3>
      <p class="member-detail-desc">{{billInfo.to}}</p>
      <h3 class="member-detail-title">出发时间</h3>
      <p class="member-detail-desc">{{billInfo.time}}</p>
      <h3 class="member-detail-title">车辆信息</h3>
      <p class="member-detail-desc img">
        <image :src="imgSrc" mode="widthFix"></image>
      </p>
    </section>

    <button class="member-leave" v-if="inThisBill" @click="leaveBill">退出拼车单</button>

    <toast :timeout="5000" v-model="toastContent"></toast>
  </div>
</template>

<script>
import wx from 'utils/wx'
import apiDomain from '@/constant'
import toast from 'comp/toast'

export default {
  data () {
    return {
      billId: '',
      billInfo: {},
      userInfo: {},
      avatarHolder: require('static/imgs/avatar.png'),
      inThisBill: false,
      imgSrc: '',
      toastContent: ''
    }
  },
  components: {
    toast
  },
  async onLoad (options) {
    console.log(`url携带的参数为: ${JSON.stringify(options)}`)
    if (options.fromIndex) {
      setTimeout(() => {
        this.toastContent = '您已经处于另外一份拼单中啦！如果要重新发起或者进入拼单，请先退出当前拼单~'
      }, 1000)
    }
    // 1. 首先会获取从url里面带来的billId
    this.billId = options.billId
    // 2. 其次会请求一次userInfo，获取userId
    this.userInfo = await this.$store.dispatch('getUserInfo')
    // 3. 然后拿这个userId去checkInBill
    const inBill = await this.$store.dispatch('checkInBill', this.userInfo.userId)
    // 4. 如果已经处于拼单，那么就会有一个billId
    if (inBill.inBill) {
      this.billId = inBill.inBill.billId
    }
    // 5. 如果没有处于拼单，那么将请求当前billId的拼单
    // 6. 如果billId都无效，则redirect到首页，否则检查当前用户是否处于该拼单当中
    await wx.startPullDownRefresh()
    await this.getBillInfo()
    await wx.stopPullDownRefresh()

    // 处理过期拼单，在设定出发时间15分钟后提示过期，踢出拼单
    // const expireHour = Number(this.billInfo.time.split(':')[0])
    // const expireMin = Number(this.billInfo.time.split(':')[1])
    // const currentHour = new Date().getHours()
    // const currentMin = new Date().getMinutes()
    // if (currentHour > expireHour || (currentHour === expireHour && currentMin - expireMin >= 15)) {
    //   this.leaveBill()
    // }
  },
  async onPullDownRefresh () {
    await this.getBillInfo()
    await wx.stopPullDownRefresh()
  },
  methods: {
    async getBillInfo () {
      this.billInfo = await this.$store.dispatch('getBillInfo', this.billId)
      if (this.billInfo.billId) {
        this.inThisBill = this.billInfo.members
          .filter(({ userId }) => userId === this.userInfo.userId).length !== 0
        this.imgSrc = `${apiDomain}${this.billInfo.img}`
      } else {
        wx.redirectTo('../index/main')
      }
      return this.billInfo
    },
    async joinBill () {
      await this.$store.dispatch('joinBill', {
        userId: this.userInfo.userId,
        billId: this.billId,
        name: this.userInfo.name,
        avatar: this.userInfo.avatar
      })
      // 进入拼单后刷新数据
      this.getBillInfo()
    },
    async leaveBill () {
      await this.$store.dispatch('leaveBill', {
        userId: this.userInfo.userId,
        billId: this.billId
      })
      // 退出拼单后直接回到首页
      wx.redirectTo('../index/main')
    }
  }
}
</script>

<style lang="less">
.member {
  min-height: 100vh;
  padding: 30rpx;
  position: relative;
  &-tips {
    color: #aaa;
    font-size: 10px;
    margin-bottom: 15rpx;
    text-align: right;
  }
  &-list {
    height: 100rpx;
    padding: 15rpx;
    margin-bottom: 30rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    position: relative;
    font-size: 28rpx;
    color: #fff;
    border-radius: 4rpx;
    background: #ff80ab;
    &.clickable {
      background: #4fc3f7;
      &:active {
        opacity: .9;
      }
    }
    &-avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 80rpx;
      overflow: hidden;
    }
    &-desc {
      position:absolute;
      right:10px;
    }
  }
  &-detail {
    &-title {
      color: #aaa;
      font-size: 20rpx;
    }
    &-desc {
      margin-bottom: 10rpx;
      padding: 0px 10rpx;
      display: block;
      font-size: 48rpx;
      span {
        font-size: 16rpx;
        color: #ddd;
      }
      &.img {
        margin-top: 15rpx;
        padding: 0;
      }
    }
  }
  &-leave {
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
</style>
