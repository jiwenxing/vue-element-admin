import Mock from 'mockjs'

export default [
  {
    url: '/common/getCategoryList.*',
    type: 'get',
    response: config => {
      const nodes = Array.from({ length: Mock.mock('@integer(1, 5)') })
        .map(item => ({
          productSortId: Mock.mock('@integer(10000, 20000)'),
          name: Mock.mock('@title(1, 3)')
        }))
      return {
        code: '1',
        result: nodes
      }
    }
  }
]

