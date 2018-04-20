import Vue from 'vue'
import Vuex from 'vuex'

import apiDomain from './constant'
import { request, getUserInfo, uploadFile } from 'utils/wx'

Vue.use(Vuex)

export default new Vuex.Store({
  actions: {
    /**
     * @param  {} {commit}
     * 获取用户公开信息
     */
    async getUserInfo ({ commit }) {
      const { userInfo } = await getUserInfo({
        withCredenitals: false
      })
      userInfo.avatar = userInfo.avatarUrl
      userInfo.name = userInfo.nickName
      userInfo.userId = encodeURIComponent(userInfo.nickName + userInfo.city + userInfo.gender + userInfo.country)
      return userInfo
    },
    /**
     * @param  {} {commit}
     * @param  { String } userId 用户ID
     * 检查用户是否已经存在于某一拼单中
     */
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
    /**
     * @param  {} {commit}
     * @param  { String } userId 用户ID
     * @param  { String } name   用户昵称
     * @param  { String } avatar 用户头像
     * @param  { String } time   出发时间
     * @param  { String } from   出发地点
     * @param  { String } to     目的地点
     * @param  { String } billId 拼单ID
     * 创建拼单
     */
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
      return res
    },
    /**
     * @param  {} {commit}
     * @param  { String } billId 拼单ID
     * 获取拼单信息
     */
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
    /**
     * @param  {} {commit}
     * @param  { String } userId 用户ID
     * @param  { String } name   用户昵称
     * @param  { String } avatar 用户头像
     * @param  { String } billId 拼单ID
     * 参加拼单
     */
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
    /**
     * @param  {} {commit}
     * @param  { String } userId 用户ID
     * @param  { String } billId 拼单ID
     * 退出拼单
     */
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
    /**
     * @param  {} {commit}
     * @param  { String } filePath 图片路径
     * @param  { String } billId   拼单ID
     * 参加拼单
     */
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
