import instance from '@/api/index.js'
const urlPrefix = '/v1/'
export default {
  getScheduleTask(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi/query_task`,
      data: params
    })
  },
  addTask(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi/add_task`,
      data: params
    })
  },
  modifyTask(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi/modify_task`,
      data: params
    })
  },
  deleteTask(params) {
    return instance({
      method: 'delete',
      url: `${urlPrefix}solopi/remove_task`,
      data: params
    })
  },

  //update
  pauseTask(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi/pause_task`,
      data: params
    })
  },
  resumeTask(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi/resume_task`,
      data: params

    })
  },
  executeSchedulerOnce(params) {
    return instance({
      method: 'post',
      url: `${urlPrefix}solopi/job_run`,
      data: params
    })
  },
}