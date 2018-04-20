<template>
  <div class="layer" v-if="show" @touchmove.stop="preventD">
    <div class="dialog">
      <div class="dialog-content">
        <h4 class="dialog-content-title">{{title}}</h4>
        <p class="dialog-content-detail">{{content}}</p>
      </div>
      <icon type="cancel" size="50" color="#fff" @click='hideDialog' />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: String,
    content: String
  },
  watch: {
    show (val) {
      val ? this.$emit('onShow') : this.$emit('onHide')
    }
  },
  methods: {
    preventD () {},
    hideDialog () {
      this.$emit('update:show', false)
    },
    onClick () {
      this.$emit('onClick')
    }
  }
}
</script>

<style lang="less">
.layer {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, .5);
  z-index: 100;
  .dialog {
    position: fixed;
    height: 100vh;
    left: 50rpx;
    right: 50rpx;
    z-index: 200;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &-content {
      background: #fff;
      width: 100%;
      max-width: 650rpx;
      margin-bottom: 60rpx;
      border-radius: 8rpx;
      &-title {
        text-align: center;
        padding: 33rpx 0;
        font-size: 34rpx;
        color: #333;
        border-bottom: 1rpx solid #e6ebf0;
      }
      &-pic {
        margin: 40rpx 50rpx 0 50rpx;
        box-sizing: border-box;
        width: 550rpx;
      }
      &-detail {
        padding: 40rpx 50rpx;
        color: #333;
        font-size: 28rpx;
      }
      &-button {
        margin: 40rpx 50rpx;
        background: #488ff0;
        color: #fff;
        font-size: 30rpx;
        border: none;
        &:active {
          background: #3880E0;
        }
      }
    }
  }
}
</style>
