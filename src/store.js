import Vue from 'vue'
import Vuex from 'vuex'

import apiDomain from './constant'
import { request, getUserInfo, uploadFile } from 'utils/wx'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    billInfo: {
      from: 'state-from',
      to: 'state-to',
      time: 'state-time: 8:00',
      billId: 'billId-'
    }
  },
  mutations: {
    GET_USER_INFO (_state, userInfo) {
      _state.userInfo = userInfo
      return userInfo
    },
    GET_BILL_INFO (_state, billInfo) {
      _state.billInfo = billInfo
    }
  },
  actions: {
    async getUserInfo ({ commit }) {
      const { userInfo } = await getUserInfo({
        withCredenitals: false
      })
      userInfo.avatar = userInfo.avatarUrl
      userInfo.name = userInfo.nickName
      userInfo.userId = encodeURIComponent(userInfo.nickName + userInfo.city + userInfo.gender + userInfo.country)
      commit('GET_USER_INFO', userInfo)
      return userInfo
    },
    async checkInBill ({ commit }, userId) {
      const res = await request({
        method: 'post',
        url: `${apiDomain}/inBill`,
        data: {
          userId
        }
      })
      return res
    },
    async createBill ({ commit }, { userId, name, avatar, time, from, to, billId }) {
      const res = await request({
        method: 'post',
        url: `${apiDomain}/create`,
        data: {
          userId,
          name,
          avatar,
          time,
          from,
          to,
          billId
        }
      })
      commit('GET_BILL_INFO', res)
      return res
    },
    async getBillInfo ({ commit }, billId) {
      const res = await request({
        method: 'post',
        url: `${apiDomain}/getBill`,
        data: {
          billId
        }
      })
      return res
    },
    async joinBill ({ commit }, { userId, name, avatar, billId }) {
      const res = await request({
        method: 'post',
        url: `${apiDomain}/join`,
        data: {
          userId,
          name,
          avatar,
          billId
        }
      })
      return res
    },
    async leaveBill ({ commit }, { userId, billId }) {
      const res = await request({
        method: 'post',
        url: `${apiDomain}/leave`,
        data: {
          userId,
          billId
        }
      })
      return res
    },
    async uploadImg ({ commit }, { filePath, billId }) {
      const res = await uploadFile({
        url: `${apiDomain}/uploadImg`,
        header: {
          'content-type': 'multipart/form-data'
        },
        filePath,
        name: 'file',
        formData: {
          'billId': billId
        }
      })
      return res
    }
  }
})
