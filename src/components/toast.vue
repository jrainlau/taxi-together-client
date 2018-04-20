<template>
  <div class="toast" :class="{'show': show}">
    <p>
      {{value}}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    timeout: {
      type: [String, Number],
      default: 3000
    }
  },
  data () {
    return {
      show: false
    }
  },
  watch: {
    value (newVal, oldVal) {
      newVal && newVal !== oldVal && (this.show = true)
    },
    show (val) {
      if (val) {
        setTimeout(() => {
          this.show = false
          this.$emit('input', '')
        }, Number(this.timeout))
      }
    }
  }
}
</script>

<style lang="less">
.toast {
  position: fixed;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 90%;
  width: max-content;
  transition: all linear .3s;
  text-align: center;
  z-index: 9999;
  &.show {
    top: 0;
  }
  p {
    padding: 25rpx 40rpx;
    border-radius: 500rpx;
    font-size: 26rpx;
    color: #fff;
    background: #4fc3f7;
    display: inline-block;
  }
}
</style>
