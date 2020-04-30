// 总主页 -> 持续集成
import ci from '@/pages/ci/index.vue'
import CiList from '@/pages/ci/CiList.vue'
import ciedit from '@/pages/ci/ciedit.vue'

const ciRouter = {
  path: 'ci',
  name: 'ci',
  component: ci,
  redirect: '/ci/cilist',
  children: [{
    path: 'cilist',
    name: 'CiList',
    component: CiList
  },
  {
    path: '/ci/:jobId/job',
    name: 'ciedit',
    component: ciedit,
  },
  ]
}
export default ciRouter