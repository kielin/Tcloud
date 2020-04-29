import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  queryTcByPorject(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi3/query`,
      data: params
    })
  },
  queryTcById(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi3/query_by_id`,
      data: params
    })
  },
  queryTcByName(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi3/query_by_id`,
      data: params
    })
  },


  //update
  updateTcById(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi2/modify_caseinfo`,
      data: params
    })
  }

}