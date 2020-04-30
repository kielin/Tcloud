
// 总主页 -> 云真机
import stf from '@/pages/stf/index.vue'
// 总主页 -> 云真机 -> 设备列表(devlist)，使用设备(usedevices)，使用详情(usedetail)
import DeviceList from '@/pages/stf/DeviceList.vue'
import useDevices from '@/pages/stf/usedevices.vue'
import useDetail from '@/pages/stf/usedetail.vue'

// 云真机(stf)
const stfRouter = {
  path: 'stf',
  name: 'stf',
  component: stf,
  redirect: '/stf/devlist',
  meta: {
    active: 'stf',
    openeds: 'stfManage'
  },
  children: [{
    path: 'devlist',
    name: 'DeviceList',
    component: DeviceList
  },
  {
    path: '/useDevices/:serial',
    name: 'useDevices',
    component: useDevices
  },
  {
    path: '/useDetail',
    name: 'useDetail',
    component: useDetail
  },
  ]
}
export default stfRouter