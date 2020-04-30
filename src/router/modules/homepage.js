// 测试中心(center) -> 项目(proj)，我的(mine)，团队(team)，资产(property)

// 总主页 -> 测试中心
import Center from '@/pages/index/Center.vue'
// 总主页 -> 测试中心 -> 项目(proj)，我的(mine)，团队(team)，资产(property)
import Proj from '@/pages/index/Proj.vue'
import mine from '@/pages/mine'
import team from '@/pages/team'
import property from '@/pages/property'

const homeRouter = {
  path: 'center',
  name: 'Center',
  component: Center,
  redirect: '/center/proj',
  children: [{
    path: 'proj',
    name: 'Proj',
    component: Proj
  },
  {
    path: 'mine',
    name: 'mine',
    component: mine,
    meta: {
      active: 'mine',
      openeds: 'mineManage'
    }
  },
  {
    path: 'team',
    name: 'team',
    component: team
  },
  {
    path: 'property',
    name: 'property',
    component: property,
    meta: {
      active: 'property',
      openeds: 'propertyManage'
    }
  }
  ]
}

export default homeRouter