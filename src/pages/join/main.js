import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    enablePullDownRefresh: true,
    navigationBarTitleText: '加入拼车',
    navigationBarBackgroundColor: '#fff',
    backgroundTextStyle: 'dark'
  }
}
