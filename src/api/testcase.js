import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  queryTcByPorject(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi/query`,
      data: params
    })
  },
  queryTcById(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi/query_by_id`,
      data: params
    })
  },
  queryTcByName(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi/query_by_id`,
      data: params
    })
  },

  //update
  updateTcById(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi/modify_caseinfo`,
      data: params
    })
  },
  executeTestcase(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi/make_execute_data`,
      data: params

    })
  },
  /**
 * 参数可为{} 或者mobileId, taskId, executor
 * 获取run results
 */
  getRunResults(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi/getRunResults`,
      data: params
    })
  },

  /**
   * 根据taskId, mobileId获取测试结果的详细信息
   */
  getDetailResult(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi/getDetailResult`,
      data: params
    })
  },

  /**
  * 根据testcase id删除
  */
  deleteTc(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi/delete_by_id`,
      data: params
    })
  }
}