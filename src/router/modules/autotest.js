// 自动化测试(auto) -> 随机测试(random)，测试报告(report)
// import editTc from '@/pages/autotest/testcase/editTc.vue'

const autoTestRouter = {
  path: '/auto',
  name: 'auto',
  component: () => import('@/pages/autotest/index.vue'),
  redirect: '/auto/appuitest',
  meta: {},
  children: [{
    path: 'random',
    name: 'RandomTest',
    component: () => import('@/pages/autotest/RandomTest.vue'),
    meta: {
      active: 'random',
      breadTextOne: 'monkey测试',
      breadTextTwo: '随机测试'
    }
  },
  {
    path: 'report',
    name: 'TestReport',
    component: () => import('@/pages/autotest/TestReport.vue'),
    meta: {
      active: 'report',
      breadTextOne: 'monkey测试',
      breadTextTwo: '随机测试报告'
    }
  },
  // {
  //   path: 'pertest',
  //   name: 'PerTest',
  //   component: () => import('@/pages/autotest/PerTest.vue'),
  //   meta: {
  //     active: 'pertest',
  //     breadTextOne: 'APP性能测试',
  //     breadTextTwo: '性能测试'
  //   }
  // },
  // {
  //   path: 'perReport',
  //   name: 'PerReport',
  //   component: () => import('@/pages/autotest/PerReport.vue'),
  //   meta: {
  //     active: 'perReport',
  //     breadTextOne: 'APP性能测试',
  //     breadTextTwo: '性能测试报告'
  //   }
  // },
  //App UI 自动化
  {
    path: 'appuitest',
    name: 'AppUITest',
    component: () => import('@/pages/autotest/AppUITest.vue'),
    meta: {
      active: 'appuitest',
      breadTextOne: 'APP UI 测试',
    }
  },
  {
    path: 'uitestReport',
    name: 'uitestReport',
    component: () => import('@/pages/autotest/appUIReport.vue'),
    meta: {
      active: 'uitestReport',
      breadTextOne: 'APP UI测试报告',
    }
  },
  {
    path: 'testcase',
    name: 'testCase',
    component: () => import('@/pages/autotest/testcase/listTc.vue'),
    // component: () => import('@/pages/module/index.vue'),
    meta: {
      active: 'testcase',
      breadTextOne: '测试用例',
    },
    // children: [{
    //   path: 'edittc',
    //   name: 'editTc',
    //   component: () => import('@/pages/autotest/testcase/editTc.vue'),
    //   meta: {
    //     active: 'edittc',
    //   }
    // }
    // ]
  },
  {
    path: 'edittc',
    name: 'editTc',
    component: () => import('@/pages/autotest/testcase/editTc.vue'),
    meta: {
      active: 'edittc',
      breadTextOne: '编辑用例',
    },

  },

  {
    path: 'chart',
    name: 'AutoChart',
    component: () => import('@/pages/autotest/AutoChart.vue'),
    meta: {
      active: 'chart',
      breadTextOne: '测评数据'
    }
  }
  ]
}
export const autoTestAsiderRouter = [autoTestRouter]
export default autoTestRouter
